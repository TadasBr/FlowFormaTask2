import {GetDataFromApiAsync, GetAgeDataFromApiAsync} from "./services/FetchApi.js"

const inventorsData = GetInventorsDataAsync();

inventorsData.then((values) => {
    PutInventorsDataIntoTable(values);
    
    document.querySelectorAll(".styled-table th").forEach(th => {
        th.addEventListener("click", () => {
            const tableElement = th.parentElement.parentElement.parentElement; 
            const headerIndex = Array.prototype.indexOf.call(th.parentElement.children, th);
            const isCurrentAscending = th.classList.contains("th-sort-asc");

            SortTableByColumn(tableElement, headerIndex, !isCurrentAscending);
        })
    })
})

/**
 * 
 * @param  {arrays} arr n arrays
 * @returns zipped array
 */
const zip = (...arr) => Array(Math.max(...arr.map(a => a.length))).fill().map((_,i) => arr.map(a => a[i])); 

/**
 * Sorts HTML table
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column Index of column to sort
 * @param {boolean} asc Determines if sorting will be in ascending order
 */
function SortTableByColumn(table, column, asc = true)
{
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    //sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier)
    })

    //Remove all existing Trs from the table
    while(tBody.firstChild) 
    {
        tBody.removeChild(tBody.firstChild);
    }
    
    //Add sorted rows
    tBody.append(...sortedRows);

    //Remember how column was sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}

/**
 * Retrieves inventors data from the apis
 * 
 * @returns InventorsData
 */
async function GetInventorsDataAsync()
{
    const baseUrl = "https://tomsen.dev/FlowFormaAPI/";

    let namesData = GetDataFromApiAsync(`${baseUrl}names`);
    let techData = GetDataFromApiAsync(`${baseUrl}tech`);
    let ageData = Promise.all([namesData]).then((values) => {
        return GetAgeDataFromApiAsync(values, baseUrl);
    });

    let inventorsArray = await Promise.all([namesData, techData, ageData]);
    
    inventorsArray = zip(inventorsArray[0], inventorsArray[1], inventorsArray[2]).map((values) => {
        return {
            name: values[0],
            tech: values[1],
            age: values[2]
        }
    });
    
    return inventorsArray;
}


/**
 * puts the data into the table
 * 
 * @param {inventorObjetArray} dataArray array of inventors object
 */
function PutInventorsDataIntoTable(dataArray)
{
    let tabledata = "";

    dataArray.map((values) => {
        tabledata += `
        <tr>
            <td>${values.name}</td>
            <td>${values.tech}</td>
            <td>${values.age}</td>
        </tr>`;
    });

    document.getElementById("table_content").innerHTML = tabledata;
}