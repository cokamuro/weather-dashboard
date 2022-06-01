const openWeathermapKey = "26430011a9e304ff62d863402ab09fcc"


//lat,long for Austin,Chicago,New York,Orlando,San Francisco,Seattle,Denver,Atlanta
//Austin: 30.26759° N, -97.74299° E
//Chicago: 41.88425° N, -87.63245° E
//New York: 40.7648, -73.9808
//Orlando: 28.5421, -81.379
//San Francisco: 37.77986° N, -122.42905° E
//Seattle: 47.60357° N, -122.32945° E
//Denver: 39.73715° N, -104.989174° E
//Atlanta: 33.74831° N, -84.39111° E



function populateWeather(city) {
    //lookup data based on city name
    //https://openweathermap.org/api/geocoding-api

    //get lat, long off of response, test for bad response
    var params = "q=" + city + "&limit=1&appid=" + openWeathermapKey
    fetch("http://api.openweathermap.org/geo/1.0/direct?" + params)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            if (data.length > 0) {
                getWeatherByGCS(data[0].lat,data[0].lon)
            } else {
                //no cities returned
                //hide display?
            }
        });
}

function getWeatherByGCS(lattitude, longitude) {
    //current weather
    //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    
    var params = "lat="+lattitude+"&lon="+longitude+"&exclude=minutely,hourly,alerts&appid="+openWeathermapKey
    fetch("https://api.openweathermap.org/data/2.5/onecall?" + params)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            if (data.length > 0) {

            } else {
                //no weather returned
            }
        });
}

function fillTodaysWeather(city,temperature,wind,humidity,uvindex,description){
    $("#selected-city").val(city);
    $("#current-date").val("1/1/1980");
    $("#current-temp").val(temperature);
    $("#current-wind").val(wind);
    $("#current-humidty").val(humidity);
    $("#current-uv-index").val(uvindex);
}
function fillForecastWeather(index,temperature,wind,humidty,description){

}

populateWeather("Statesville");