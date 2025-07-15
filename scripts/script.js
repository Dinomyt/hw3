// Variables
const apiKey = 'f6c3711024d25bbf7faf01870c0cf091';
let temperatureUnits = ["standard", "imperial", "metric"];
let city = 'Stockton'; 
let numberOfDays = 7;
let choice = 1;
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}`;
// let sevenDayApi = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=${numberOfDays}&appid=${apiKey}&units=${temperatureUnits[choice]}`;
//Not used since we're not doing 5 hour forecast
let next5HoursForecast = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}&cnt=5`;
const cityInput = document.getElementById("cityInput");
let sevenDayApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}`;





// ------------------------------------------------------------------------------------Start of------------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------API Functions---------------------------------------------------------------------------------------- //
async function getWeather() {
  try {
    let currentCityDisplay = document.getElementById("currentCityDisplay");
    let currentTempDisplay = document.getElementById("currentTempDisplay");
    let currentWeatherDisplay = document.getElementById("currentWeatherDisplay");
    let todaysDate = document.getElementById("todaysDate");
    let currentDay = document.getElementById("currentDay");
    let maxTemp = document.getElementById("maxTemp");
    let minTemp = document.getElementById("minTemp");
    let feelsLikeTemp = document.getElementById("feelsLikeTemp");
    let humidity = document.getElementById("humidity");
    const response = await fetch(apiUrl);
    const data = await response.json();
    // console.log(data);
    const formattedDate = getFormattedDate(data.dt);
    const dayOfWeek = getDayOfWeek(data.dt);
    currentCityDisplay.innerHTML = data.name;
    currentTempDisplay.innerHTML = `${Math.round(data.main.temp)}&deg;`;
    currentWeatherDisplay.innerHTML = data.weather[0].description;
    todaysDate.innerHTML = formattedDate;
    currentDay.innerHTML = dayOfWeek;
    maxTemp.innerHTML = `${Math.round(data.main.temp_max)}&deg`;
    minTemp.innerHTML = `${Math.round(data.main.temp_min)}&deg;`;
    feelsLikeTemp.innerHTML = `${Math.round(data.main.feels_like)}&deg;`;
    humidity.innerHTML = `${data.main.humidity}%`
    updateWeatherImage(data.weather[0].icon ,'currentWeatherImg')
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

async function getForecast() {
  try {
    const response = await fetch(sevenDayApi);
    const data = await response.json();

    // Display 5-day forecastz
    console.log(JSON.stringify(data));
    document.getElementById('dayOne').textContent = getDayOfWeek(data.list[0].dt);
    document.getElementById('dayOneDate').textContent = getFormattedDate(data.list[0].dt);
    document.getElementById('dayOneTemp').innerHTML = `${Math.round(data.list[0].main.temp)}&deg;`;
    updateWeatherImage(data.list[0].weather[0].icon, 'dayOneImg');

    document.getElementById('dayTwo').textContent = getDayOfWeek(data.list[8].dt);
    document.getElementById('dayTwoDate').textContent = getFormattedDate(data.list[8].dt);
    document.getElementById('dayTwoTemp').innerHTML = `${Math.round(data.list[8].main.temp)}&deg;`;
    updateWeatherImage(data.list[8].weather[0].icon, 'dayTwoImg');

    document.getElementById('dayThree').textContent = getDayOfWeek(data.list[16].dt);
    document.getElementById('dayThreeDate').textContent = getFormattedDate(data.list[16].dt);
    document.getElementById('dayThreeTemp').innerHTML = `${Math.round(data.list[16].main.temp)}&deg;`;
    updateWeatherImage(data.list[16].weather[0].icon, 'dayThreeImg');

    document.getElementById('dayFour').textContent = getDayOfWeek(data.list[24].dt);
    document.getElementById('dayFourDate').textContent = getFormattedDate(data.list[24].dt);
    document.getElementById('dayFourTemp').innerHTML = `${Math.round(data.list[24].main.temp)}&deg;`;
    updateWeatherImage(data.list[24].weather[0].icon, 'dayFourImg');

    document.getElementById('dayFive').textContent = getDayOfWeek(data.list[32].dt);
    document.getElementById('dayFiveDate').textContent = getFormattedDate(data.list[32].dt);
    document.getElementById('dayFiveTemp').innerHTML = `${Math.round(data.list[32].main.temp)}&deg;`;
    updateWeatherImage(data.list[32].weather[0].icon, 'dayFiveImg');

  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
}
// -------------------------------------------------------------------------------------End of-------------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------API Functions---------------------------------------------------------------------------------------- //
















// ------------------------------------------------------------------------------------Start of------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------------------------Weather Functions-------------------------------------------------------------------------------------- //

function getDayOfWeek(timestamp) {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
}

function getFormattedDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(date);
}

function updateWeatherImage(iconCode, imageElementId) {
  const weatherImageElement = document.getElementById(imageElementId);
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
  const altText = `Weather icon for ${iconCode}`;

  weatherImageElement.classList.add('weather-icon')
  weatherImageElement.src = iconUrl;
  weatherImageElement.alt = altText;
}

function searchButtonHandler() {
  const newCity = cityInput.value.trim(); 
  if (!isValidCityName(newCity)) {
    return;
  }
  if (newCity !== "") {
    city = newCity; // Update the city variable
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}`;
    sevenDayApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}`;
    next5HoursForecast = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}&cnt=5`;
    getForecast(); // Refresh the forecast based on the new city
    getWeather(); // Refresh the weather based on the new city
    updateFavoriteButton(city); // Recalls our function to check if current city is already favorited
  }
}

function saveToLocalStorage(city) {
  city = city.toLowerCase();

  // Check if localStorage already contains cities
  let savedCities = localStorage.getItem('savedCities');
  if (!savedCities) {
      // If localStorage is empty, initialize an empty array
      savedCities = [];
  } else {
      // If localStorage contains cities, parse the JSON string to convert it back to an array
      savedCities = JSON.parse(savedCities);
  }

  // Convert all saved cities to lowercase
  savedCities = savedCities.map(savedCity => savedCity.toLowerCase());

  // Check if the city is already present in the saved cities
  if (!savedCities.includes(city)) {
      // If the city is not already present, add it to the array
      savedCities.push(city);
      // Save the updated array back to localStorage after converting it to a JSON string
      localStorage.setItem('savedCities', JSON.stringify(savedCities));
      // Alert the user that the city has been saved
      alert(`"${city}" has been added to your favorites!`);
  } else {
  // If the city is already present, remove it from the array
  savedCities = savedCities.filter(savedCity => savedCity !== city);
  // Save the updated array back to localStorage after converting it to a JSON string
  localStorage.setItem('savedCities', JSON.stringify(savedCities));
  // Alert the user that the city has been removed from favorites
  alert(`"${city}" has been removed from your favorites!`);
  }
}

// Function to update the favorite button's background image and classes
function updateFavoriteButton(city) {
  // Convert the city to lowercase
  city = city.toLowerCase();

  // Check if the city is already favorited
  let savedCities = localStorage.getItem('savedCities');
  if (savedCities) {
      // If localStorage contains cities, parse the JSON string to convert it back to an array
      savedCities = JSON.parse(savedCities);
      savedCities = savedCities.map(savedCity => savedCity.toLowerCase());
      if (savedCities.includes(city)) {
          // If the city is favorited, add the 'favorited' class to the button and remove 'not-favorited'
          document.querySelector('.favBtn').classList.add('favorited');
          document.querySelector('.favBtn').classList.remove('not-favorited');
          return; 
      }
  }

  // If the city is not favorited, add the 'not-favorited' class to the button and remove 'favorited'
  document.querySelector('.favBtn').classList.add('not-favorited');
  document.querySelector('.favBtn').classList.remove('favorited');
}

function populateFavoriteCities() {
  // Get favorited cities from local storage
  let savedCities = localStorage.getItem('savedCities');
  if (savedCities) {
    // Parse JSON string to array
    savedCities = JSON.parse(savedCities);

    // Get the <ul> element
    const favoriteCitiesList = document.getElementById('favoriteCitiesList');

    // Clear any existing content
    favoriteCitiesList.innerHTML = '';

    // Loop through each favorited city and create <li> element with a button
    savedCities.forEach(city => {
      const li = document.createElement('li');
      li.classList.add('nav-item');
      li.classList.add('favoriteCities');
      
      const button = document.createElement('button');
      button.classList.add('favBtn');
      button.addEventListener('click', function() {
        saveToLocalStorage(city);
        updateFavoriteButton(city);
        populateFavoriteCities();
      });
      
      li.textContent = city.toUpperCase();
      li.style.fontSize = "30px";

      li.appendChild(button);

      //Add an event listener to our li
      li.addEventListener('click', function() {
        // Update the weather information based on the clicked city
        city = city; // Update the city variable
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}`;
        sevenDayApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}`;
        next5HoursForecast = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}&cnt=5`;
        getForecast(); // Refresh the forecast based on the new city
        getWeather(); // Refresh the weather based on the new city
        updateFavoriteButton(city); // Recalls our function to check if current city is already favorited
      });

      favoriteCitiesList.appendChild(li);
    });
  }
}

function isValidCityName(cityName) {
    const trimmed = cityName.trim();
    const validPattern = /^[a-zA-Z\s]+$/;

    if (trimmed.length < 2) {
        alert("City name must be at least 2 characters long.");
        return false;
    }

    if (!validPattern.test(trimmed)) {
        alert("City name can only contain letters and spaces.");
        return false;
    }

    return true;
}

// -------------------------------------------------------------------------------------End of-------------------------------------------------------------------------------------------- //
// --------------------------------------------------------------------------------Weather Functions-------------------------------------------------------------------------------------- //







// ------------------------------------------------------------------------------------Start of-------------------------------------------------------------------------------------------- //
// ---------------------------------------------------------------------------------Event Listeners---------------------------------------------------------------------------------------- //

// Add event listener for the keydown event on the input field
cityInput.addEventListener("keydown", function(event) {
  // Check if the pressed key is the Enter key (key code 13)
  if (event.keyCode === 13) {
    // Prevent the default action of the Enter key (submitting the form)
    event.preventDefault();
    
    // Call the function to handle the search button click
    searchButtonHandler();
  }
});


document.getElementById("searchButton").addEventListener("click", function() {
  const newCity = document.getElementById("cityInput").value.trim(); // Get the value from the input field and remove leading/trailing spaces
  if (newCity !== "") {
    city = newCity; // Update the city variable
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}`;
    sevenDayApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}`;
    next5HoursForecast = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${apiKey}&units=${temperatureUnits[choice]}&cnt=5`;
    getForecast(); // Refresh the forecast based on the new city
    getWeather(); // Refresh the weather based on the new city
    updateFavoriteButton(city); // Recalls our function to check if current city is already favorited
    
  }
});


// Add event listener to the favorite button
document.querySelector('.favBtn').addEventListener('click', function() {
  saveToLocalStorage(city);
  updateFavoriteButton(city);
  populateFavoriteCities();
});




// -------------------------------------------------------------------------------------End of--------------------------------------------------------------------------------------------- //
// ---------------------------------------------------------------------------------Event Listeners---------------------------------------------------------------------------------------- //


populateFavoriteCities();
getForecast();
getWeather();
updateFavoriteButton(city);