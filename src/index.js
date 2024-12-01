import "./css/reset.css";
import "./css/styles.css";

import { getTodaysWeatherData } from "./api";
import {
	getValidatedLocation,
	showError,
	clearError,
	getTemperature,
	handleUserError,
	handleDeveloperError,
	clearElement,
} from "./utility";

const locationInput = document.getElementById("location-input");
const searchButton = document.querySelector("[data-search-button]");
const weatherContainer = document.querySelector("[data-container-weather]");
const weatherTemplate = document.querySelector("[data-weather-template]");
const weatherContent = weatherContainer.querySelector("[data-weather-content]");
const errorContainer = document.querySelector("[data-error-container]");
const unitToggle = document.querySelector("[data-unit-toggle]");

let currentLocation = "";
let currentWeatherData = null;
let currentUnit = "C";

// Event Handlers
searchButton.addEventListener("click", handleWeatherSearch);
locationInput.addEventListener("keypress", (event) => {
	if (event.key === "Enter") {
		searchButton.click();
	}
});

unitToggle.addEventListener("change", (event) => handleUnitToggle(event));

async function handleWeatherSearch() {
	const locationQuery = getValidatedLocation(locationInput);

	if (!locationQuery) {
		showError("Please enter a location.", errorContainer, weatherContent);
		return;
	}

	clearError(errorContainer);

	try {
		const weatherData = await getTodaysWeatherData(
			locationQuery,
			errorContainer,
			weatherContent
		);
		console.log(`Today's Weather in ${locationQuery}:`, weatherData);

		// Check if weatherData is valid before storing
		if (weatherData) {
			currentLocation = locationQuery;
			currentWeatherData = weatherData;

			renderWeather(locationQuery, weatherData);
		} else {
			throw new Error("Invalid weather data received.");
		}
	} catch (error) {
		if (error.message.includes("Invalid location")) {
			handleUserError(
				"Invalid location. Please check the location name and try again.",
				errorContainer,
				weatherContent
			);
		} else {
			handleDeveloperError(error, errorContainer);
		}
	}
}

function renderWeather(location, weatherData) {
	// Validate weatherData
	try {
		if (!weatherData || typeof weatherData.temp === "undefined") {
			throw new Error("Invalid weather data provided for rendering.");
		}

		clearElement(weatherContent);
		const weatherCard = weatherTemplate.content.cloneNode(true);

		const temperature = getTemperature(weatherData.temp, currentUnit);
		const tempMax = getTemperature(weatherData.tempmax, currentUnit);
		const tempMin = getTemperature(weatherData.tempmin, currentUnit);

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
		).textContent = `Temperature: ${temperature.toFixed(1)}°${currentUnit}`;
		weatherCard.querySelector(
			"[data-wind-speed]"
		).textContent = `Wind Speed: ${weatherData.windspeed}mph`;
		weatherCard.querySelector(
			"[data-max-temp]"
		).textContent = `Max Temp: ${tempMax.toFixed(1)}°${currentUnit}`;
		weatherCard.querySelector(
			"[data-rain-prob]"
		).textContent = `Rain Prob: ${weatherData.precipprob}%`;
		weatherCard.querySelector(
			"[data-min-temp]"
		).textContent = `Min Temp: ${tempMin}°${currentUnit}`;
		weatherCard.querySelector(
			"[data-humidity]"
		).textContent = `Humidity:  ${weatherData.humidity}%`;

		weatherContent.appendChild(weatherCard);
		locationInput.value = "";
	} catch (error) {
		handleDeveloperError(error, errorContainer);
	}
}

function getWeatherIcon(icon) {
	if (!icon) {
		console.warn("No icon provided, using default icon.");
		return "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/2nd%20Set%20-%20Monochrome/unknown.svg";
	}
	return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/2nd%20Set%20-%20Monochrome/${icon}.svg`;
}

function handleUnitToggle(event) {
	try {
		currentUnit = event.target.value;

		if (currentLocation && currentWeatherData) {
			renderWeather(currentLocation, currentWeatherData);
		} else {
			throw new Error("No weather data available to re-render.");
		}
	} catch (error) {
		handleUserError(error, errorContainer, weatherContent);
	}
}
