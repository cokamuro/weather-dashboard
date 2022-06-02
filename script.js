const openWeathermapKey = "26430011a9e304ff62d863402ab09fcc"
var elQuickButtons = $("#quick-buttons")

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
            if (data.length > 0) {
                var item=data[0]
                getWeatherByGCS(item.name, item.lat, item.lon);
            } else {
                //no cities returned
                //hide display?
            }
        });
}

function getWeatherByGCS(city, lattitude, longitude) {
    //current weather
    //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

    var params = "lat=" + lattitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + openWeathermapKey
    fetch("https://api.openweathermap.org/data/2.5/onecall?" + params)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var current = data.current;
            fillTodaysWeather(city, current.temp, current.wind_speed, current.humidity, current.uvi, current.weather[0].main);
            for(i=0;i<5;i++){
                var forecast = data.daily[i];
                //console.log(forecast)
                fillForecastWeather(i,forecast.temp.max, forecast.wind_speed, forecast.humidity, forecast.weather[0].main)
            }
            var cities=localStorage.getItem("weather-dash-cities");
            if(!cities.includes(city)){localStorage.setItem("weather-dash-cities",cities+","+city);}
            $("#city").val("");
            populateButtons();
        })
}

function fillTodaysWeather(city, temperature, wind, humidity, uvindex, description) {
    $("#selected-city").text(city);
    $("#current-temp").text(temperature);
    $("#current-wind").text(wind);
    $("#current-humidity").text(humidity);
    $("#current-uv-index").text(uvindex);
    $("#current-uv-index").attr("color","red")
    var fDate = new Date;
    fDate.setDate(fDate.getDate());
    $("#current-date").text(moment(fDate).format("ddd M/D"));
}
function fillForecastWeather(index, temperature, wind, humidity, description) {
    $("#fcast-temp-"+index).text(temperature);
    $("#fcast-wind-"+index).text(wind);
    $("#fcast-humidity-"+index).text(humidity);
    var fDate = new Date;
    fDate.setDate(fDate.getDate()+index+1);
    $("#fcast-date-"+index).text(moment(fDate).format("ddd M/D"));
}

function populateLocalStorage(){
    var cities=localStorage.getItem("weather-dash-cities");
    if(cities==null){localStorage.setItem("weather-dash-cities","Atlanta,Charlotte,Los Angeles")};
}

function populateButtons(){
    var cities=localStorage.getItem("weather-dash-cities");
    cities=cities.split(",");
    elQuickButtons.html("");
    for(i=0;i<cities.length;i++){
        elQuickButtons.append('<button class="btn qb btn-warning text-dark w-100 m-1">'+cities[i]+'</button>');    
    }
    
}

$("#search").on("click", function() {
    populateWeather($("#city").val());
})

elQuickButtons.on("click", function(event) {
    populateWeather($(event.target).text());
})


populateLocalStorage();
populateButtons();
populateWeather("Charlotte");