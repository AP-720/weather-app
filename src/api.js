const API_KEY = "SVCLPL25MLHM7CZH4BRDCVNPK";

async function getWeatherData(query) {
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
		console.error(`Error fetching weather data`, error);
		throw error;
	}
}

// Filters and returns the weather for todays date
function getTodaysWeather(responseData) {
	const todaysDate = new Date().toISOString().split("T")[0];
	const todaysWeather = responseData.days.find(
		(day) => day.datetime === todaysDate
	);
	return todaysWeather;
}

async function getTodaysWeatherData(location) {
	try {
		const data = await getWeatherData(location);
		const todaysWeather = getTodaysWeather(data);
		return todaysWeather;
	} catch (error) {
		console.error("Error Fetching Todays Weather:", error);
		throw error;
	}
}

export { getWeatherData, getTodaysWeather, getTodaysWeatherData };
