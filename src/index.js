import "./css/reset.css";
import "./css/styles.css";

import { getTodaysWeatherData } from "./api";

const locationInput = document.getElementById("location-input");
const searchButton = document.querySelector("[data-search-button]");
const weatherContainer = document.querySelector("[data-container-weather]");
const weatherTemplate = document.querySelector("[data-weather-template]");
const weatherContent = weatherContainer.querySelector("[data-weather-content]");
const errorContainer = document.querySelector("[data-error-container]");

searchButton.addEventListener("click", handleWeatherSearch);
locationInput.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		searchButton.click();
	}
});

function getValidatedLocation() {
	if (locationInput.validity.valueMissing) {
		locationInput.setCustomValidity("Enter location");
		locationInput.reportValidity();
		return;
	} else {
		locationInput.setCustomValidity("");
		const location = locationInput.value.trim();
		locationInput.value = "";
		return location;
	}
}

async function handleWeatherSearch() {
	const locationQuery = getValidatedLocation();

	if (!locationQuery) {
		console.error("No location entered, aborting search.");
		showError("Please enter a location.");
		return;
	}

	clearError();

	try {
		const weatherData = await getTodaysWeatherData(locationQuery);
		console.log(`Todays Weather in ${locationQuery}:`, weatherData);
		renderWeather(locationQuery, weatherData);
	} catch (error) {
		console.error("Failed to fetch weather:", error);
		showError(error.message);
	}
}

function renderWeather(location, weatherData) {
	clearElement(weatherContent);
	const weatherCard = weatherTemplate.content.cloneNode(true);

	weatherCard.querySelector(
		"[data-weather-title]"
	).textContent = `The weather today in ${location}`;
	weatherCard.querySelector("[data-weather-icon]").src = getWeatherIcon(
		weatherData.icon
	);
	weatherCard.querySelector(
		"[data-weather-description]"
	).textContent = `${weatherData.description}`;
	weatherCard.querySelector(
		"[data-temp]"
	).textContent = `Temperature: ${weatherData.temp}°C`;
	weatherCard.querySelector(
		"[data-wind-speed]"
	).textContent = `Wind Speed: ${weatherData.windspeed}mph`;
	weatherCard.querySelector(
		"[data-max-temp]"
	).textContent = `Max Temp: ${weatherData.tempmax}°C`;
	weatherCard.querySelector(
		"[data-rain-prob]"
	).textContent = `Rain Prob: ${weatherData.precipprob}%`;
	weatherCard.querySelector(
		"[data-min-temp]"
	).textContent = `Min Temp: ${weatherData.tempmin}°C`;
	weatherCard.querySelector(
		"[data-humidity]"
	).textContent = `Humidity:  ${weatherData.humidity}%`;

	weatherContent.appendChild(weatherCard);
}

function clearElement(element) {
	element.replaceChildren();
}

function getWeatherIcon(icon) {
	if (!icon) {
		console.warn("No icon provided, using default icon.");
		return "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/2nd%20Set%20-%20Monochrome/unknown.svg";
	}
	return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/2nd%20Set%20-%20Monochrome/${icon}.svg`;
}

// Display error message in UI
function showError(message) {
	clearElement(weatherContent);
	errorContainer.textContent = message;
	errorContainer.style.display = "block";
}

function clearError() {
	errorContainer.textContent = "";
	errorContainer.style.display = "none";
}
