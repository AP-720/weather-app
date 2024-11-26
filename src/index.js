import "./css/reset.css";
import "./css/styles.css";

import { fetchTodaysWeather } from "./api";

(async () => {
	try {
		const weatherResponse = await fetchTodaysWeather();
		console.log("Todays Weather:", weatherResponse);
	} catch (error) {
		console.error("Failed to fetch weaterh:", error);
	}
})();
