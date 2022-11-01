import { GetDataFromApiAsync, GetAgeDataFromApiAsync } from "../services/FetchApi.js"
import { TechInventor } from "../models/TechInventor.js";

export { GetInventorsDataAsync}

//import { baseApiUrl } from "../config/config"

/**
 * 
 * @param  {arrays} arr n arrays
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