// Function to fetch weather data from the Open-Meteo API
async function fetchWeatherData() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=48.2085&longitude=16.3721&current=temperature_2m,relative_humidity_2m,rain,showers&hourly=wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function mapWeatherCodeToEmoji(ww) {
    if (ww >= 0 && ww <= 19) {
        // No precipitation, special cases for fog, duststorm, etc.
        return '🌤️'; // Assuming 11 and 12 represent fog
    } else if (ww >= 20 && ww <= 29) {
        // Precipitation, fog, or thunderstorm previously, but not now
        return '🌥️'; // Partly cloudy
    } else if (ww >= 30 && ww <= 39) {
        // Duststorm, sandstorm, or drifting/blowing snow
        return '💨'; // Wind face or use a custom icon for dust/sandstorm
    } else if (ww >= 40 && ww <= 49) {
        // Fog or ice fog
        return '🌫️'; // Fog
    } else if (ww >= 50 && ww <= 59) {
        // Drizzle
        return '🌦️'; // Sun behind rain cloud
    } else if (ww >= 60 && ww <= 69) {
        // Drizzle
        return '🌧️'; // Sun behind rain cloud
    } else if (ww >= 70 && ww <= 79) {
        // Solid precipitation not in showers
        return '❄️'; // Snowflake for solid precipitation
    } else if (ww >= 80 && ww <= 99) {
        // Showery precipitation, or with current/recent thunderstorm
        return '⛈️'; // Cloud with lightning and rain
    } else {
        return '❓'; // Unknown or unhandled code
    }
}

// Function to get daily weather data along with emojis
async function getDailyWeatherData() {
    const weatherData = await fetchWeatherData();
    if (weatherData && weatherData.daily) {
        const { time, weather_code, temperature_2m_min, temperature_2m_max } = weatherData.daily;
        return weather_code.map((code, index) => {
            const emoji = mapWeatherCodeToEmoji(code);
            const minTemp = temperature_2m_min[index];
            const maxTemp = temperature_2m_max[index];
            const date = time[index];
            return { date, emoji, minTemp, maxTemp };
        });
    }
    return [];
}

// Function to display daily weather data in a table
async function displayDailyWeatherData() {
    const dailyWeather = await getDailyWeatherData();
    const weatherContainer = document.getElementById('weatherContainer');
    if (weatherContainer) {
        let tableHTML = `<table><tr><th>Date</th><th>Weather</th><th>Min Temp (°C)</th><th>Max Temp (°C)</th></tr>`;
        dailyWeather.forEach(({ date, emoji, minTemp, maxTemp }) => {
            tableHTML += `<tr><td>${date}</td><td>${emoji}</td><td>${minTemp}</td><td>${maxTemp}</td></tr>`;
        });
        tableHTML += `</table>`;
        weatherContainer.innerHTML = tableHTML;
    }
}

// Initialize the display function and update it every 60 minutes
displayDailyWeatherData();
setInterval(displayDailyWeatherData, 60 * 60 * 1000);  // 60 minutes interval
