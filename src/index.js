import "./css/reset.css";
import "./css/styles.css";

import { getWeather } from "./api";

async function fetchWeather() {
	try {
		const data = await getWeather("Wales");
		console.log("Weather Data:", data);
	} catch (error) {
		console.error("Error:", error);
	}
}

fetchWeather();