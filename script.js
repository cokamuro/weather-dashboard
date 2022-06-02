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