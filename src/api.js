import { handleUserError, handleDeveloperError } from "./utility";

const API_KEY = "SVCLPL25MLHM7CZH4BRDCVNPK";

async function getWeatherData(query, errorContainer, weatherContent) {
	try {
		const response = await fetch(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
				query
			)}?unitGroup=uk&include=days&key=${API_KEY}&contentType=json`,
			{ mode: "cors" }
		);

		// Checks the error type, if its invalid location get message for that.
		if (!response.ok) {
			const errorMessage =
				response.status === 400
					? "Invalid location. Please check the location name and try again."
					: `Unexpected error: ${response.statusText}`;
			throw new Error(errorMessage);
		}

		const responseData = await response.json();

		return responseData;
	} catch (error) {
		handleUserError(error.message, errorContainer, weatherContent);
		throw error;
	}
}

// Filters and returns the weather for todays date
function getTodaysWeather(responseData, errorContainer) {
	const todaysDate = new Date().toISOString().split("T")[0];
	const todaysWeather = responseData.days.find(
		(day) => day.datetime === todaysDate
	);

	if (!todaysWeather) {
		const errorMessage = "No weather data available for today.";
		handleDeveloperError(new Error(errorMessage), errorContainer);
		return null;
	}

	return todaysWeather;
}

async function getTodaysWeatherData(location, errorContainer, weatherContent) {
	try {
		const data = await getWeatherData(location, errorContainer, weatherContent);
		const todaysWeather = getTodaysWeather(data, errorContainer);
		return todaysWeather;
	} catch (error) {
		console.error("Error Fetching Todays Weather:", error);
		throw error;
	}
}

export { getWeatherData, getTodaysWeather, getTodaysWeatherData };
