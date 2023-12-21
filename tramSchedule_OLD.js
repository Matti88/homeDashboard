const timetables = {
    'weekday_school': {
        5: [3, 10, 17, 24, 31, 37, 44, 51, 57],
        6: [4, 11, 17, 24, 31, 39, 46, 52, 57],
        7: [1, 8, 15, 21, 28, 35, 41, 48, 55],
        8: [3, 10, 17, 23, 31, 38, 43, 54],
        9: [1, 9, 16, 22, 28, 35, 42, 48, 55],
        10: [1, 9, 16, 24, 31, 39, 46, 54],
        11: [1, 9, 16, 24, 31, 39, 46, 54],
        12: [1, 9, 16, 24, 31, 39, 46, 54],
        13: [1, 9, 16, 24, 30, 37, 44, 50, 57],
        14: [1, 9, 16, 24, 31, 39, 46, 54, 58],
        15: [1, 9, 16, 22, 29, 36, 42, 49, 56],
        16: [2, 9, 16, 22, 29, 36, 42, 49, 56],
        17: [2, 9, 16, 22, 29, 36, 42, 49, 56],
        18: [3, 10, 16, 23, 30, 37, 44, 52],
        19: [0, 8, 15, 23, 30, 38, 45, 53],
        20: [3, 13, 23, 33, 43, 53],
        21: [3, 13, 23, 33, 43, 53],
        22: [4, 19, 34, 49],
        23: [4, 19, 34, 49],
        0: [4]
    },
    'saturday': {
        5: [4, 26, 47],
        6: [2, 15, 25, 35, 45, 55],
        7: [5, 15, 23, 33, 43, 53],
        8: [3, 13, 23, 33, 43, 53],
        9: [2, 12, 22, 32, 42, 52],
        10: [2, 12, 22, 32, 42, 52],
        11: [2, 12, 22, 32, 42, 52],
        12: [2, 12, 22, 32, 42, 52],
        13: [2, 12, 22, 32, 42, 52],
        14: [2, 12, 22, 32, 42, 52],
        15: [2, 12, 22, 32, 42, 52],
        16: [2, 12, 22, 32, 42, 52],
        17: [2, 12, 22, 32, 42, 52],
        18: [2, 12, 22, 32, 42, 52],
        19: [3, 13, 23, 33, 43, 53],
        20: [3, 13, 23, 33, 43, 53],
        21: [3, 13, 23, 33, 43, 53],
        22: [6, 19, 34, 42, 49],
        23: [4, 19, 34, 49],
        0: [4]
    },
    'weekday_holiday': {
        5: [3, 17, 26, 36, 45, 53],
        6: [0, 8, 15, 23, 30, 38, 45, 53, 59],
        7: [7, 14, 22, 29, 37, 44, 52, 59],
        8: [7, 14, 22, 29, 37, 44, 52],
        9: [0, 7, 15, 22, 30, 37, 45, 52],
        10: [0, 7, 15, 22, 30, 37, 45, 52],
        11: [0, 7, 15, 22, 30, 37, 45, 52],
        12: [0, 7, 15, 22, 30, 37, 45, 52],
        13: [0, 7, 15, 22, 30, 37, 45, 52],
        14: [0, 7, 15, 22, 30, 37, 45, 52, 59],
        15: [7, 14, 22, 29, 37, 44, 52, 59],
        16: [7, 14, 22, 29, 37, 44, 52, 59],
        17: [7, 14, 22, 29, 37, 44, 52, 59],
        18: [7, 14, 22, 29, 37, 44, 52],
        19: [0, 8, 15, 23, 30, 38, 45, 53],
        20: [3, 13, 23, 33, 43, 53],
        21: [3, 13, 23, 33, 43, 53],
        22: [4, 19, 34, 42, 49],
        23: [4, 19, 34, 49],
        0: [4]
    },
    'sunday_public_holiday': {
        5: [4, 26, 47],
        6: [7, 27, 47],
        7: [1, 16, 31, 46],
        8: [1, 16, 31, 46],
        9: [1, 16, 31, 43, 53],
        10: [3, 13, 23, 33, 43, 53],
        11: [3, 13, 23, 33, 43, 53],
        12: [3, 13, 23, 33, 43, 53],
        13: [3, 13, 23, 33, 43, 53],
        14: [3, 13, 23, 33, 43, 53],
        15: [3, 13, 23, 33, 43, 53],
        16: [3, 13, 23, 33, 43, 53],
        17: [3, 13, 23, 33, 43, 53],
        18: [3, 13, 23, 33, 43, 53],
        19: [3, 13, 23, 33, 43, 53],
        20: [3, 13, 23, 33, 43, 53],
        21: [3, 13, 23, 33, 43, 53],
        22: [6, 19, 34, 49],
        23: [4, 19, 34, 49],
        0: [4]
    }
}


let lastHolidayFetch = null;
let cachedHolidays = [];


// Function to get public holidays
async function getPublicHolidays(year = '2023', country = 'AT') {
    const currentTime = new Date();
    // Check if last fetch was more than 1 hour ago
    if (lastHolidayFetch === null || (currentTime - lastHolidayFetch) >= 3600000) { // 3600000 milliseconds = 1 hour
        const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`;
        try {
            const response = await fetch(url);
            cachedHolidays = (await response.json()).map(holiday => new Date(holiday.date));
            lastHolidayFetch = currentTime;
        } catch (error) {
            console.error('Error fetching public holidays:', error);
        }
    }
    return cachedHolidays;
}

// Check if a date is a public holiday
function isPublicHoliday(date, holidays) {
    return holidays.some(holiday => holiday.getTime() === date.getTime());
}

// Calculate the next tram time
async function whenNextTram() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const holidays = await getPublicHolidays();

    let timetable;
    if (isPublicHoliday(today, holidays) || today.getDay() === 0) {
        timetable = timetables.sunday_public_holiday;
    } else if (today.getDay() === 6) {
        timetable = timetables.saturday;
    } else if (today.getDay() < 5 && !(now.getMonth() === 6 || now.getMonth() === 7)) {
        timetable = timetables.weekday_school;
    } else {
        timetable = timetables.weekday_holiday;
    }



    let departures = [];
    for (let hour = currentHour; hour < 24; hour++) {
        if (timetable.hasOwnProperty(hour)) {
            for (let minute of timetable[hour]) {
                if (currentHour < hour || (currentHour === hour && currentMinute < minute)) {
                    departures.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
                    if (departures.length === 4) {
                        return departures;
                    }
                }
            }
        }
    }

    // If not enough departures were found today, add the first departures of the next day
    for (let hour of Object.keys(timetable).sort()) {
        for (let minute of timetable[hour]) {
            departures.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
            if (departures.length === 4) {
                return departures;
            }
        }
    }

    return departures.length > 0 ? departures : ['No trams available for today.'];
}


// Update the displayed times
function updateDisplay() {
    whenNextTram().then(departureTimes => {
        document.getElementById('nextTramTime').textContent = `Next departures: ${departureTimes.join(', ')}`;
    });
}

// Initialize the update process
setInterval(updateDisplay, 10000);
updateDisplay();