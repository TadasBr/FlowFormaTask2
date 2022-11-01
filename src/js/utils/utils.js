import { GetDataFromApiAsync, GetAgeDataFromApiAsync } from "../services/FetchApi.js"
import { TechInventor } from "../models/TechInventor.js";

export { GetInventorsDataAsync, PutInventorsDataIntoTable, SortTechInventorsArrayByColumn }

//import { baseApiUrl } from "../config/config"

/**
 * 
 * @param  {type[]} arr n arrays
 * @returns zipped array
 */
const zip = (...arr) => Array(Math.max(...arr.map(a => a.length))).fill().map((_,i) => arr.map(a => a[i])); 

/**
 * Retrieves inventors data from the apis
 * 
 * @returns InventorsData
 */
async function GetInventorsDataAsync()
{
    const baseApiUrl = "https://tomsen.dev/FlowFormaAPI/";

    let namesData = GetDataFromApiAsync(`${baseApiUrl}names`);
    let techData = GetDataFromApiAsync(`${baseApiUrl}tech`);
    let ageData = Promise.all([namesData]).then((values) => {
        return GetAgeDataFromApiAsync(values, baseApiUrl);
    });
 
    let inventorsArray = await Promise.all([namesData, techData, ageData]);
     
    inventorsArray = zip(inventorsArray[0], inventorsArray[1], inventorsArray[2]).map((values) => {
        return new TechInventor(values[0], values[1], values[2]);
    });
     
    return inventorsArray;
}

/**
* puts the data into the table
* 
* @param {TechInventor[]} dataArray array of inventors object
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


/**
 * Sorts TechInventors array by column
 * 
 * @param {Inventors[]} inventorsArray inventors array to sort
 * @param {HTMLTableElement} table table header to change style and remember
 * @param {number} column index of column to sort
 * @param {boolean} asc Determines if sorting will be in ascending order
 */
function SortTechInventorsArrayByColumn(inventorsArray, table, column, asc = true)
{
    switch(column)
    {
        case 0:
            inventorsArray.sort((a, b) => {
                let fa = a.name.toLowerCase();
                let fb = b.name.toLowerCase();
                
                return asc? fa < fb ? -1 : 1 : fa < fb ? 1 : -1
            })
            break;
        case 1:
            inventorsArray.sort((a, b) => {
                let fa = a.tech.toLowerCase();
                let fb = b.tech.toLowerCase();
        
                return asc? fa < fb ? -1 : 1 : fa < fb ? 1 : -1
            })
            break;
        default: 
            asc ? inventorsArray.sort((a, b) => a.age - b.age) : inventorsArray.sort((a, b) => b.age - a.age);
            break;
    }

    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);

    return inventorsArray;
}
