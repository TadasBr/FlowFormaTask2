import { GetInventorsDataAsync } from "./utils/utils.js";

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
 * puts the data into the table
 * 
 * @param {inventorObjetArray} dataArray array of inventors object
 */
function PutInventorsDataIntoTable(dataArray)
{
    document.getElementById("table_content").innerHTML = "";

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