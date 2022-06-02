const openWeathermapKey = "26430011a9e304ff62d863402ab09fcc"
var elQuickButtons = $("#quick-buttons")

function populateWeather(city) {
    //lookup data based on city name
    //https://openweathermap.org/api/geocoding-api

    //get lat, long off of response, test for bad response
    var params = "q=" + city + "&limit=1&appid=" + openWeathermapKey
    fetch("https://api.openweathermap.org/geo/1.0/direct?" + params)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                var item=data[0]
                getWeatherByGCS(item.name, item.lat, item.lon);
            } else {
                alert("No matching city was found!");
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
            console.log(current)
            fillTodaysWeather(city, current.temp, current.wind_speed, current.humidity, current.uvi, current.weather[0].main,current.weather[0].icon);
            for(i=0;i<5;i++){
                var forecast = data.daily[i];
                fillForecastWeather(i,forecast.temp.max, forecast.wind_speed, forecast.humidity, forecast.weather[0].main,forecast.weather[0].icon)
            }
            var cities=localStorage.getItem("weather-dash-cities");
            if(!cities.includes(city)){localStorage.setItem("weather-dash-cities",cities+","+city);}
            $("#city").val("");
            populateButtons();
        })
}

function fillTodaysWeather(city, temperature, wind, humidity, uvindex, description,icon) {
    $("#selected-city").text(city);
    $("#current-temp").text(temperature);
    $("#current-wind").text(wind);
    $("#current-humidity").text(humidity);
    $("#current-uv-index").text(uvindex);
    var uvIndexClass="btn-success" //green
    if(uvindex>=3){uvIndexClass="btn-warning"} //yellow
    if(uvindex>=8){uvIndexClass="btn-danger"}  //red
    $("#current-uv-index").attr("class","btn active "+uvIndexClass)
    
    var fDate = new Date;
    fDate.setDate(fDate.getDate());
    $("#current-date").text(moment(fDate).format("ddd M/D"));
    $("#current-icon").attr("src","http://openweathermap.org/img/wn/"+icon+"@4x.png")
    $("#current-icon").attr("alt",description)
}
function fillForecastWeather(index, temperature, wind, humidity, description, icon) {
    //clear, rain, clouds
    $("#fcast-desc-"+index).text(description);
    $("#fcast-temp-"+index).text(temperature);
    $("#fcast-wind-"+index).text(wind);
    $("#fcast-humidity-"+index).text(humidity);
    var fDate = new Date;
    fDate.setDate(fDate.getDate()+index+1);
    $("#fcast-date-"+index).text(moment(fDate).format("ddd M/D"));
    $("#fcast-icon-"+index).attr("src","http://openweathermap.org/img/wn/"+icon+"@2x.png")
    $("#fcast-icon-"+index).attr("alt",description)
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