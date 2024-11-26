const API_KEY = "SVCLPL25MLHM7CZH4BRDCVNPK";

async function getWeatherData(query) {
	try {
		const response = await fetch(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
				query
			)}?unitGroup=uk&include=days&key=${API_KEY}&contentType=json`,
			{ mode: "cors" }
		);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const responseData = await response.json();

		return responseData;
	} catch (error) {
		console.error(`Error fetching weather data`, error);
		throw error;
	}
}

function extractTodaysWeather(responseData) {
	const todaysDate = new Date().toISOString().split("T")[0];
	const todaysWeather = responseData.days.find(
		(day) => day.datetime === todaysDate
	);
	return todaysWeather;
}

async function fetchTodaysWeather(location = "London") {
	try {
		const data = await getWeatherData(location);
		const todaysWeather = extractTodaysWeather(data);
		return todaysWeather;
	} catch (error) {
		console.error("Error Fetching Todays Weather:", error);
		throw error;
	}
}

export { getWeatherData, extractTodaysWeather, fetchTodaysWeather };
