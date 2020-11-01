var cityInputEl = document.querySelector("#cityInput");
var userFormEl = document.querySelector("#user-form");
var todayEl = document.querySelector(".today");
var forecastEl = document.querySelector(".forecast");
var searchedEl = document.querySelector(".searched");
var apiKey = "9c5b0cc85b6a9548eebb91bbcbe6ed35";

// Create a search function for the city
var searchCity = function(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();

    // validate the response
    if (city) {
        getCityInfo(city);
        getForecast(city);
        cityInputEl.value = "";
      } else {
        alert("Please enter a city");
      }
}

// Create a search function that works on the searched-city buttons
var findCity = function(event){
  var city = event.target.textContent;
  console.log(city)
  getCityInfo(city);
  getForecast(city);
}

// Create a function for adding searched cities to the dom
var createSearched = function(city){
  // Check if the city is already on the list
  children = searchedEl.children
  for (i=0; i < children.length; i++){
    // If so, don't add it again (break function)
    if (city === children[i].textContent){
      return
    }
  }
  // Add searched city to "searched" div in dom
  var cityEl = document.createElement("button");
  cityEl.textContent = city;
  searchedEl.append(cityEl);
  
  // Give the button similar functionality to the searchbar
  cityEl.onclick = findCity;
}

// Create a fetch function for TODAY'S WEATHER
var getCityInfo = function(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            displayInfo(data, city);
            createSearched(city);
          })
        } else {
          alert("Error: " + response.statusText);
        }
      });
}

// Create a fetch function for 5-DAY FORECAST
var getForecast = function(city){
  var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
  fetch(forecastUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayForecast(data,city);
      })
    }
  })
}

// Display Info for Today's Weather
var displayInfo = function(data, city){
  while (todayEl.firstChild) {
    todayEl.removeChild(todayEl.firstChild);
  }

  // Create variables for city name, temperature, humidity, windspeed and UV
  var city = data.name;
  var temp = data.main.temp;
  var humidity = data.main.humidity;
  var windspeed = data.wind.speed;

  // Create DOM elements for each variable
  var nameEl = document.createElement("h2")
  var date = moment().format('L');
  var icon = document.createElement("img");
  nameEl.textContent = city + " (" + date + ")";

  // Find the icon and attach it to the city/date
  icon.setAttribute("src","http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png")
  nameEl.appendChild(icon);
  todayEl.appendChild(nameEl);

  // Create DOM elements for temp, humidity, and windspeed
  var tempEl = document.createElement("p");
  tempEl.textContent = "Temperature: " + temp + "\u00B0F"
  todayEl.appendChild(tempEl);

  var humidityEl = document.createElement("p");
  humidityEl.textContent = "Humidity: " + humidity + "%";
  todayEl.appendChild(humidityEl);

  var windspeedEl = document.createElement("p");
  windspeedEl.textContent = "Wind Speed: " + windspeed + " MPH";
  todayEl.appendChild(windspeedEl);

  // Get lat and lon to find the UV index with another fetch request
  lat = data.coord.lat;
  lon = data.coord.lon;

  // Make another fetch request for UV information
  var uvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" +lat + "&lon="+ lon + "&appid=" + apiKey;
  fetch(uvUrl).then(function(response2) {
    response2.json().then(function(data) {
      var uv = data.value;
      // Attach UVI to the page
      var uvEl = document.createElement("p");
      uvEl.innerHTML = "<p>UV Index: <span>" + uv + "</span></p>";
    

      if (uv < 3) {
        $("#uv").className = "favorable"
      }
      else if (uv < 6) {
        $("#uv").className = "moderate"
      }
      else{
        $("#uv").className = "severe"
      }

      todayEl.appendChild(uvEl);
    });
  })
}

// Display Info for 5 Day Forecast
var displayForecast = function(data,city){
  while (forecastEl.firstChild) {
    forecastEl.removeChild(forecastEl.firstChild);
  }
  // Create a counter to keep track of the date
  j = 1;
  for (i=3; i < 36 ;i+=8){
    // Create variables for the date, temperature, humidity and icon
    date = moment().add(j,'day').format("L");
    icon = document.createElement("img");
    icon.setAttribute("src","http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png")

    temp = data.list[i].main.temp;
    humidity = data.list[i].main.humidity;
    
    // Create cards for each day
    cardEl = document.createElement("div");
    cardEl.className = "card";

    // Create DOM elements for the variables
    dateEl = document.createElement("h6");
    dateEl.textContent = date;
    tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + temp + "\u00B0F";
    humidityEl = document.createElement("p")
    humidityEl.textContent = "Humidity: " + humidity + "%";

    // Append variables to card and card to forecast element
    cardEl.appendChild(dateEl);
    cardEl.appendChild(icon);
    cardEl.appendChild(tempEl);
    cardEl.appendChild(humidityEl);
    forecastEl.appendChild(cardEl);

    j++
  }

}

userFormEl.addEventListener("submit", searchCity);
