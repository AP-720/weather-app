import "./css/reset.css";
import "./css/styles.css";

import { getTodaysWeatherData } from "./api";

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

function getValidatedLocation() {
	if (locationInput.validity.valueMissing) {
		locationInput.setCustomValidity("Enter location");
		locationInput.reportValidity();
		return;
	} else {
		locationInput.setCustomValidity("");
		const location = locationInput.value.trim();
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
		console.error("Failed to fetch weather:", error);
		showError(error.message);
	}
}

function renderWeather(location, weatherData) {
	// Validate weatherData
	if (!weatherData || typeof weatherData.temp === "undefined") {
		console.error("Invalid weather data passed to renderWeather:", weatherData);
		showError("Failed to render weather data. Please try again.");
		return;
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

// Temp Conversion functions
function convertTemperature(temp, toUnit) {
	return toUnit === "F" ? (temp * 9) / 5 + 32 : ((temp - 32) * 5) / 9;
}

// temperature conversion logic in a helper function
function getTemperature(value, unit) {
	return unit === "C" ? value : convertTemperature(value, "F");
}

function handleUnitToggle(event) {
	currentUnit = event.target.value;

	// Re-render the weather card with the updated unit
	if (currentLocation && currentWeatherData) {
		renderWeather(currentLocation, currentWeatherData);
	} else {
		console.warn("No weather data available to re-render.");
		showError("Please fetch the weather data first.");
	}
}
