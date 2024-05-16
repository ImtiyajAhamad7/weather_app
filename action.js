const API_KEY = '176ed3da09ce430aad9155339241205';
const day = 6;

const day1Location = document.querySelector('.location');
    const day1Condition = document.querySelector('.condition');
    const day1Temp = document.querySelector('.temp');
    const image = document.querySelector('.weather-icon');

// Function to store search history in local storage
// const storeSearchHistory = (city) => {
//     let searches = JSON.parse(localStorage.getItem('searches')) || [];
//     // Add the new search to the beginning of the array
//     searches.unshift(city);
//     // Keep only the last 5 searches
//     searches = searches.slice(0, 5);
//     localStorage.setItem('searches', JSON.stringify(searches));
// }

// Function to populate the dropdown with recent searches based on the input
// const populateSearchHistory = (input) => {
//     const recentSearches = JSON.parse(localStorage.getItem('searches')) || [];
//     const filteredSearches = recentSearches.filter(search => search.toLowerCase().startsWith(input.toLowerCase()));
//     const dropdown = document.getElementById('recent-searches');
//     // Clear existing options
//     dropdown.innerHTML = '';
//     // Add filtered recent searches as options
//     filteredSearches.forEach((search, index) => {
//         const option = document.createElement('option');
//         option.value = search;
//         option.text = `${index + 1}. ${search}`;
//         dropdown.appendChild(option);
//     });
// }

// Function to show dropdown with recent search history
// const showDropdown = (event) => {
//     const input = event.target;
//     const dropdown = document.getElementById('search-dropdown');
//     if (input.value.trim() !== '') {
//         dropdown.classList.remove('hidden');
//         populateSearchHistory(input.value.trim());
//     } else {
//         dropdown.classList.add('hidden');
//     }
// }

// Function to handle when a recent search is selected from the dropdown
// const selectRecentSearch = () => {
//     const selectedCity = document.getElementById('recent-searches').value;
//     document.getElementById('city').value = selectedCity;
// }

const searchWeather = async () => {
    const city = document.getElementById('city').value;
    // if (city) {
    //     storeSearchHistory(city);
    //     populateSearchHistory();
    // }
    day1Location.innerHTML = 'loading....'
    const data = await setWeatherData(null, null, city);
    
    if (data) {
        updateCurrentWeather(data);
        updateForecast(data.forecast.forecastday);
    }
}

const searchCurrentLocation = () => {
    day1Location.innerHTML = 'loading....'
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const data = await setWeatherData(latitude, longitude);
            if (data) {
                updateCurrentWeather(data);
                updateForecast(data.forecast.forecastday);
            }
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

const fetchWeatherData = async (latitude, longitude, city) => {
    let query = city ? `q=${city}` : `q=${latitude},${longitude}`;
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&${query}&days=${day}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

const setWeatherData = async (latitude, longitude, city = null) => {
    const data = await fetchWeatherData(latitude, longitude, city);
    return data;
}

const updateCurrentWeather = (data) => {
    
    
    day1Location.innerHTML = data.location.name;
    day1Condition.innerHTML = `Weather: ${data.current.condition.text}`;
    day1Temp.innerHTML = `Temperature: ${data.current.feelslike_c}°C`;
    image.src = `${data.current.condition.icon}`;
}

const updateForecast = (forecast) => {
    console.log(forecast);
    for (let i = 1; i <= 5; i++) {
        const forecastDay = forecast[i];
        console.log(`Forecast for day ${i}:`, forecastDay);

        const dateElement = document.querySelector(`.day${i}date`);
        const conditionElement = document.querySelector(`.day${i}condition`);
        const tempElement = document.querySelector(`.day${i}temprature`);
        const image = document.querySelector(`.weather-icon${i}`);

        console.log(`dateElement for day${i}:`, dateElement);
        console.log(`conditionElement for day${i}:`, conditionElement);
        console.log(`tempElement for day${i}:`, tempElement);

        if (dateElement && conditionElement && tempElement ) {
            dateElement.innerHTML = `Day ${i}: ${forecastDay.date}`;
            conditionElement.innerHTML = `Weather: ${forecastDay.day.condition.text}`;
            tempElement.innerHTML = `Temperature: ${forecastDay.day.avgtemp_c}°C`;
            image.src = `${forecastDay.day.condition.icon}`;
        } else {
            console.error(`Missing elements for day ${i}. Make sure the class names match.`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateSearchHistory();
    searchCurrentLocation();
});
