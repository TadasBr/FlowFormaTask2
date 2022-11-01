import { GetInventorsDataAsync, PutInventorsDataIntoTable, SortTechInventorsArrayByColumn } from "./utils/utils.js";

let inventorsData = GetInventorsDataAsync();

inventorsData.then((values) => {
    PutInventorsDataIntoTable(values);
    
    document.querySelectorAll(".styled-table th").forEach(th => {
        th.addEventListener("click", () => {
            const tableElement = th.parentElement.parentElement.parentElement; 
            const headerIndex = Array.prototype.indexOf.call(th.parentElement.children, th);
            const isCurrentAscending = th.classList.contains("th-sort-asc");

            inventorsData = SortTechInventorsArrayByColumn(values, tableElement, headerIndex, !isCurrentAscending);

            PutInventorsDataIntoTable(inventorsData);
        })
    })
})
