// Fetches departure data from the API
async function fetchDepartureData() {
    const url = 'https://www.wienerlinien.at/ogd_realtime/monitor?activateTrafficInfo=stoerunglang&rbl=3439';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

// Extracts the next five departure times from the data
function getNextFiveDepartures(data) {
    if (!data || !data.data || !data.data.monitors) {
        return [];
    }

    const departures = data.data.monitors.flatMap(monitor => 
        monitor.lines.flatMap(line => 
            line.departures.departure.map(d => d.departureTime.timeReal)
        )
    );

    return departures.slice(0, 5);
}

// Update the displayed times
function updateDisplay() {
    fetchDepartureData().then(data => {
        const nextDepartures = getNextFiveDepartures(data);
        document.getElementById('nextTramTime').textContent = `Next departures: ${nextDepartures.join(', ')}`;
    }).catch(error => {
        console.error('Failed to fetch departure data:', error);
        document.getElementById('nextTramTime').textContent = 'Failed to load departure times';
    });
}

// Initialize the update process
setInterval(updateDisplay, 60000);
updateDisplay();
