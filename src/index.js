import "./css/reset.css";
import "./css/styles.css";

import { getTodaysWeatherData } from "./api";

const locationInput = document.getElementById("location-input");
const searchButton = document.querySelector("[data-search-button]");

searchButton.addEventListener("click", handleWeatherSearch);

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
		return;
	}

	try {
		const weatherData = await getTodaysWeatherData(locationQuery);
		console.log(`Todays Weather in ${locationQuery}:`, weatherData);
	} catch (error) {
		console.error("Failed to fetch weather:", error);
	}
}
