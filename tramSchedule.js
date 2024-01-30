let latestData = null; // Variable to store the latest fetched data

// Fetches departure data from the API
async function fetchDepartureData() {
    try {
        const wienerLinien = "https://www.wienerlinien.at/ogd_realtime/monitor?activateTrafficInfo=stoerunglang&rbl=3439";
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(wienerLinien)}`);

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();

        latestData = JSON.parse(data.contents); // Ensuring this line is within the try block
        console.log(latestData);

    } catch (error) {
        console.error('Failed to fetch departure data:', error);
    }
}


/// Extracts the next five departure times from the data and formats them
function getNextFiveDepartures(data) {
    if (!data || !data.data || !data.data.monitors) {
        return [];
    }

    const departures = data.data.monitors.flatMap(monitor =>
        monitor.lines.flatMap(line =>
            line.departures.departure.map(d => {
                const dateTime = new Date(d.departureTime.timeReal);
                return dateTime.getHours().toString().padStart(2, '0') + ':' + dateTime.getMinutes().toString().padStart(2, '0');
            })
        )
    );

    return departures.slice(0, 5);
}




// Update the displayed times
function updateDisplay() {
    if (latestData) {
        const nextDepartures = getNextFiveDepartures(latestData);
        document.getElementById('nextTramTime').textContent = `Next departures: ${nextDepartures.join(', ')}`;
    } else {
        document.getElementById('nextTramTime').textContent = 'Waiting for data...';
    }
}


// Fetch data every hour
setInterval(fetchDepartureData, 1800000); // 1800000 milliseconds = 1/2 hour
fetchDepartureData(); // Initial fetch

// Update display every 2 minutes
setInterval(updateDisplay, 1200); // it takes a while and this first update should work more often
updateDisplay(); // Initial display update