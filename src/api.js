const API_KEY = "SVCLPL25MLHM7CZH4BRDCVNPK";

async function getWeather(query) {
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

export { getWeather };
