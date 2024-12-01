// import { clearElement } from "./index";

export function getValidatedLocation(inputElement) {
	if (inputElement.validity.valueMissing) {
		inputElement.setCustomValidity("Enter location");
		inputElement.reportValidity();
		return null;
	} else {
		inputElement.setCustomValidity("");
		return inputElement.value.trim();
	}
}

// Render Error Messages
export function showError(message, errorContainer, weatherContent) {
	if (weatherContent) {
		clearElement(weatherContent); // This ensures weatherContent is cleared
	}
	errorContainer.textContent = message;
	errorContainer.style.display = "block";
}

export function clearError(errorContainer) {
	errorContainer.textContent = "";
	errorContainer.style.display = "none";
}

export function clearElement(element) {
	if (element) {
		element.replaceChildren();
	} else {
		console.warn("Element is undefined:", element);
	}
}

// Temperature Conversions
export function convertTemperature(temp, toUnit) {
	return toUnit === "F" ? (temp * 9) / 5 + 32 : ((temp - 32) * 5) / 9;
}

export function getTemperature(value, unit) {
	if (typeof value !== "number") {
		throw new Error("Invalid temperature value");
	}
	return unit === "C" ? value : convertTemperature(value, "F");
}

//  Error Handling

export function handleUserError(message, errorContainer, weatherContent) {
	console.warn(message); // Log for debugging
	showError(message, errorContainer, weatherContent);
}

export function handleDeveloperError(error, errorContainer) {
	console.error(error); // Log full error stack
	showError("Something went wrong. Please try again later.", errorContainer);
}
