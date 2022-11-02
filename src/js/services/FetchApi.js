export { GetDataFromApiAsync, GetAgeDataFromApiAsync }

/**
 * Retrieves data from single API call
 * 
 * @param {string} url url to API
 * @returns data retrieved from API
 */
async function GetDataFromApiAsync(url) { 
    try {
        const response = await fetch(url);

        return response.json();
    }
    catch(err){
        alert(err);
    }
}

/**
 * Retrieves age data from multiple API calls
 * 
 * @param {string[]} nameArray array of names
 * @returns array of inventors age
 */
async function GetAgeDataFromApiAsync(nameArray, baseUrl) 
{
    const ageData = await Promise.all(nameArray[0].map(async (name) => {
            try{
                const response = await fetch(`${baseUrl}getdate/${name}`);
 
                return await response.json();
            }   
            catch(err){
                alert(err);
            }
        })
    );
 
    return ageData;
}