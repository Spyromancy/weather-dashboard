var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var weatherEl = document.querySelector("#weather");
var errorMessageEl = document.querySelector("#error-message");
var todaysForecastEl = document.querySelector("#todays-forecast");
var fiveDayForecastEl = document.querySelector("#five-day-forecast");

var key = 'ceb0c8c4ec2960693373d4d319b27581';

var day = moment();

var cityName = ""

var city = {
    cityName:" ",
    lat:0,
    lon:0
};
var cityArr = [];

var apiData;
var geoData;
// 
function formSubmitHandler(event){
    event.preventDefault();
    // get value from input element
    var city = cityInputEl.value.trim();

    if(city){
        getLatLong(city);
        cityInputEl.value="";
    }
    else {
        weatherEl.classList.add("d-none");
        errorMessageEl.textContent = "Please enter a city name"
        errorMessageEl.classList.remove("d-none")
    }
}

// convert city to lat/long
function getLatLong(city) {
    day = moment();
    errorMessageEl.classList.add("d-none")
    var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=1&appid=${key}`
    var lat;
    var long;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                if(data.length>0){ // aparently just if(data) was not enough. i don't know why.
                    console.log(data);
                    geoData = data;
                    
                    city.lat = lat = data[0].lat;
                    console.log(city.lat, lat, data[0].lat);
                    
                    city.lon = long = data[0].lon;
                    console.log(city.lon, long, data[0].lon);
                    
                    cityName = data[0].name;
                    console.log(cityName, data[0].name);
                    
                    getWeather(lat,long);
                }
                
                else {
                    weatherEl.classList.add("d-none");
                    errorMessageEl.textContent = "Sorry, we couldn't find that city"
                    errorMessageEl.classList.remove("d-none")
                }
            });
        }
        else {
            weatherEl.classList.add("d-none");
            errorMessageEl.textContent = "Sorry, something went wrong"
            errorMessageEl.classList.remove("d-none")
        }
    });

};

//Call API, Save reference
function getWeather(lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely,alerts&appid=${key}`
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                apiData = data;
                cityArr.push(city); // we don't want to push the city to the array until we know everything works
                displayForecast(data.current);
                displayFiveDay(data.daily.slice(1, 6));
                errorMessageEl.classList.add("d-none")
                weatherEl.classList.remove("d-none");
            });
        }
        else {
            weatherEl.classList.add("d-none");
            errorMessageEl.textContent = "Sorry, something went wrong."
            errorMessageEl.classList.remove("d-none")
        }
    });
};

// Display Today's Forecast
function displayForecast(forecast) {
    //Change City
    todaysForecastEl.querySelector(".city").textContent= cityName;
    // Change date
    todaysForecastEl.querySelector(".date").textContent= day.format("L");
    // Temp
    todaysForecastEl.querySelector(".today-temp").textContent= forecast.temp;
    // Wind
    todaysForecastEl.querySelector(".today-wind").textContent= forecast.wind_speed;
    // Humid
    todaysForecastEl.querySelector(".today-humid").textContent= forecast.humidity
    // UVI
    uviHandler(forecast.uvi);
};

function uviHandler(uvi){
    uviEl= todaysForecastEl.querySelector(".today-uv");
    uviEl.textContent=uvi;
    if(uvi <= 2){
        uviEl.classList.add("bg-success")
        uviEl.classList.remove("bg-warning", "bg-danger");
    }
    else if(uvi <= 7){
        uviEl.classList.add("bg-warning")
        uviEl.classList.remove("bg-success", "bg-danger");
    }
    else {
        uviEl.classList.add("bg-danger")
        uviEl.classList.remove("bg-warning", "bg-success");
    }

}

// Displya 5-day Forecast
function displayFiveDay(forecastArr) {
    // right. lets get weird.
    var i = 0;
    $(".five-day").each( function() {
        $(this).children("h4").text(day.add(1,"day").format("L"));
        
        var id = forecastArr[i].weather[0].icon;
        var alt = forecastArr[i].weather[0].description;
        $(this).children(".weather-icon").attr("src",`https://openweathermap.org/img/wn/${id}.png`) 
        $(this).children(".weather-icon").attr("alt",alt);
        
        $(this).find(".5-day-temp").text(forecastArr[i].temp.day);

        $(this).find(".5-day-wind").text(forecastArr[i].wind_speed);

        $(this).find(".5-day-humid").text(forecastArr[i].humidity);
        i++;
    })
};

// Save to localStorage
function saveInfo() { };

// Load from localStorage
function loadInfo() { };

// Clicked city should call API
function cityRecall() {};

userFormEl.addEventListener("submit", formSubmitHandler);