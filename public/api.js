// API
const endpoint = "http://api.open-notify.org/iss-now.json";
const arrayOfData = [];
function setData(dataArr) {
    arrayOfData.push(dataArr['iss_position']['latitude'], dataArr['iss_position']['longitude']);
    return arrayOfData;
}

async function getData() {
    const response = await fetch(endpoint);
    const responseJson = await response.json();
    const data = setData(responseJson);
    console.log(data);
    setInterval(() => {
        getData();
    }, 5000)
    return data
}
