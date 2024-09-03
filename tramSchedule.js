let latestData = null; // Variable to store the latest fetched data

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock(); // Initialize the clock immediately on page load


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

// Calculate the time difference between the earliest departure time and the current time
function calculateTimeDifference(nextDepartures) {
    const now = new Date();
    
    let earliestDeparture = new Date();

    // Split the time string into hours and minutes
    let [hours, minutes] = nextDepartures[0].split(":").map(Number);

    // Set the hours and minutes to today's date
    earliestDeparture.setHours(hours);
    earliestDeparture.setMinutes(minutes);
    earliestDeparture.setSeconds(0);  // Op

    // Calculate the time difference in minutes
    const timeDifference = Math.ceil((earliestDeparture.getTime() - now.getTime()) / 1000 / 60);

    return timeDifference;
}


// Implement the code for the TODO comment
function updateDisplay() {
    if (latestData) {
        const nextDepartures = getNextFiveDepartures(latestData);
        const timeDifference = calculateTimeDifference(nextDepartures);

        const imageElement = document.getElementById('tramImage');
        if (timeDifference > 4) {
            imageElement.src = './images/slowPace.png';
        } else if (timeDifference >= 3) {
            imageElement.src = './images/run.png';
        } else {
            imageElement.src = './images/missedTrain.jpg'; //TODO: We are getting this error: Cannot set properties of null (setting 'src') 
        }

        document.getElementById('nextTramTime').textContent = `${nextDepartures.join(', ')}\n  next train in ${timeDifference} minutes`; //TODO: make a newline between the time and the next train
    } else {
        document.getElementById('nextTramTime').textContent = 'Waiting for data...';
    }
}


// Fetch data every hour
setInterval(fetchDepartureData, 1300); 
fetchDepartureData(); // Initial fetch

// Update display every 2 minutes
setInterval(updateDisplay, 1200); // it takes a while and this first update should work more often
updateDisplay(); // Initial display update

