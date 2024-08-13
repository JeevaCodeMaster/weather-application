const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchTabIcon = document.querySelector("[data-searchIconWeather]");
const userContainer = document.querySelector("[weather-container]");

const grantAccessConatiner = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


let currentTab = userTab;
currentTab.classList.add("current-tab");
const API_key = "c3abc64b60612f352233bc97e1248aa0";
getfromSessionStorage();

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        clickedTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) { // is not active

            userInfoContainer.classList.remove("active");
            grantAccessConatiner.classList.remove('active');
            searchForm.classList.add("active");

        }
        else {

            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");  // to hide weather information
            getfromSessionStorage();

        }
    }
}

userTab.addEventListener('click', () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
});
searchTab.addEventListener('click', () => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
});
searchTabIcon.addEventListener('click', () => {
    //pass clicked tab as input parameter
    switchTab(searchTabIcon);
});


function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessConatiner.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}
// fetching error page details
const errorPage = document.querySelector(".error");

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // make grant container invisible
    grantAccessConatiner.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    // API call 
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        let data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    } catch (err) {
        // loadingScreen.classList.remove("active");
        // errorPage.classList.add("active");
        console.log("error found:", err);
        // 404 wala error visible


    }
}



function renderWeatherInfo(weatherInfo) {
    // fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-Humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    //  fetch values weather information and put here
    if (weatherInfo?.cod != "404") {
        errorPage.classList.remove("active");
        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = ` https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = weatherInfo?.main?.temp;
        windSpeed.innerText = weatherInfo?.wind?.speed;
        humidity.innerText = weatherInfo?.main?.humidity;
        cloudiness.innerText = weatherInfo?.clouds?.all;
    } else {
        errorPage.classList.add("active");
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        setTimeout(() => {
            switchTab(userTab);
            errorPage.classList.remove("active");
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
           
        }, 2000);
    }


}


// fetch location access
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("No geolocation support available");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);


// search section handel
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "")
        return;
    else {
        fetchSearchWeatherInfo(cityName);
    }

})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessConatiner.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
        );
        const data = await response.json();
        searchInput.value="";
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    } catch (e) {
        // loadingScreen.classList.remove("active");
        console.log("Error Found:", e);

    }


}




// async function fetchWeatherDetails() {
//     // let lattitude = 15.3333;
//     // let longitude = 74.0833;
//     try {
//         let city = "durgapur";

//         const responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);

//         const data = await responce.json();
//         console.log("weather data:", data);

//         // let newpara = document.createElement('p');
//         // newpara.textContent = `temparature of ${city} is ${data?.main?.temp.toFixed(2)} deg`;
//         // document.body.appendChild(newpara);
//         renderWeatherInfo(data);
//     }
//     catch (e) {
//         // handel the error
//         console.log(e);
//     }

// }

// async function getCustomeWeatherDetails() {

//     try {
//         let lat = 15.3333;
//         let lon = 74.0833;

//         let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
//         let data = await result.json();
//         console.log(data);
//     }
//     catch (error) {
//         console.log("error found:", error);
//     }

// }