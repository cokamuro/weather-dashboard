const openWeathermapKey = "26430011a9e304ff62d863402ab09fcc"
var elQuickButtons = $("#quick-buttons")

function populateWeather(city) {
    //lookup data based on city name
    //https://openweathermap.org/api/geocoding-api

    //get lat, long off of response, test for bad response - limit to 1 city returned
    var params = "q=" + city + "&limit=1&appid=" + openWeathermapKey
    fetch("https://api.openweathermap.org/geo/1.0/direct?" + params)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 0) {
                var item = data[0]
                // call getWeatherByGCS, passing city name, latitude, and longitude
                getWeatherByGCS(item.name, item.lat, item.lon);
            } else {
                alert("No matching city was found!");
            }
        });
}

function getWeatherByGCS(city, lattitude, longitude) {
    //current weather
    //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

    //set units to imperial - degrees F/wind mph
    var params = "lat=" + lattitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + openWeathermapKey
    fetch("https://api.openweathermap.org/data/2.5/onecall?" + params)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var current = data.current;
            //call function to fill current weather information with passed params
            fillTodaysWeather(city, current.temp, current.wind_speed, current.humidity, current.uvi, current.weather[0].main, current.weather[0].icon);
            for (i = 0; i < 5; i++) {
                var forecast = data.daily[i];
                //call to fill the individual forecast cards with passed params
                fillForecastWeather(i, forecast.temp.max, forecast.wind_speed, forecast.humidity, forecast.weather[0].main, forecast.weather[0].icon)
            }
            //get saved cities delimited string
            var cities = localStorage.getItem("weather-dash-cities");
            //if the city is not in the clities string, append "," and current city, and save the value
            if (!cities.includes(city)) { localStorage.setItem("weather-dash-cities", cities + "," + city); }
            //clear the city from the search
            $("#city").val("");
            //clear and dynamically repopulate the city buttons
            populateButtons();
        })
}

function fillTodaysWeather(city, temperature, wind, humidity, uvindex, description, icon) {
    //fill the elements with the passed param values
    $("#selected-city").text(city);
    $("#current-temp").text(temperature);
    $("#current-wind").text(wind);
    $("#current-humidity").text(humidity);
    $("#current-uv-index").text(uvindex);
    //pick uv index formatting, based in uvindex value
    var uvIndexClass = "btn-success" //green
    if (uvindex >= 3) { uvIndexClass = "btn-warning" } //yellow
    if (uvindex >= 8) { uvIndexClass = "btn-danger" }  //red
    //apply uv index formatting
    $("#current-uv-index").attr("class", "btn active " + uvIndexClass)

    //get and format the date
    var fDate = new Date;
    fDate.setDate(fDate.getDate());
    $("#current-date").text(moment(fDate).format("ddd M/D"));
    //set the image icon, based on weather conditions
    $("#current-icon").attr("src", "http://openweathermap.org/img/wn/" + icon + "@4x.png")
    //set alt text based on text description
    $("#current-icon").attr("alt", description)
}
function fillForecastWeather(index, temperature, wind, humidity, description, icon) {
    //set element values
    $("#fcast-temp-" + index).text(temperature);
    $("#fcast-wind-" + index).text(wind);
    $("#fcast-humidity-" + index).text(humidity);
    //get forecast date for the index
    var fDate = new Date;
    fDate.setDate(fDate.getDate() + index + 1);
    $("#fcast-date-" + index).text(moment(fDate).format("ddd M/D"));
    //get image from openweathermap.org
    $("#fcast-icon-" + index).attr("src", "http://openweathermap.org/img/wn/" + icon + ".png")
    //adding the text description of the forecast to the alt tag of the image
    $("#fcast-icon-" + index).attr("alt", description)
}

function populateLocalStorage() {
    //read local storage
    var cities = localStorage.getItem("weather-dash-cities");
    //if blank, populate with default cities
    if (cities == null) { localStorage.setItem("weather-dash-cities", "Atlanta,Charlotte,Los Angeles") };
}

function populateButtons() {
    //retreive the saved cities
    var cities = localStorage.getItem("weather-dash-cities");
    //convert the delimited string to an array
    cities = cities.split(",");
    elQuickButtons.html("");
    //create the buttons
    for (i = 0; i < cities.length; i++) {
        elQuickButtons.append('<button class="btn qb btn-warning text-dark w-100 m-1">' + cities[i] + '</button>');
    }

}

//add event handler for city search button
$("#search").on("click", function () {
    populateWeather($("#city").val());
})

//add the event handler on the city buttons div for proper click delegation on dynamically-created buttons
elQuickButtons.on("click", function (event) {
    populateWeather($(event.target).text());
})

//start page processing
populateLocalStorage();
populateButtons();
populateWeather("Charlotte");