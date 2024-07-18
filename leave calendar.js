const leaveData = [
    {
        "employee": "Rishi",
        "leave_date": "08/07/2024 - 25/07/2024",
        "type": "Sick Leave",
        "notes": "fever"
    },
    {
        "employee": "Isanur",
        "leave_date": "08/07/2024 - 08/07/2024",
        "type": "Sick Leave",
        "notes": "fever"
    },
    {
        "employee": "Isanur",
        "leave_date": "11/07/2024 - 13/07/2024",
        "type": "Sick Leave",
        "notes": "-"
    }
];

function showWeekFromDate() {
    const dateInput = document.getElementById("week-start").value;
    const selectedDate = new Date(dateInput);
    const startOfWeek = getStartOfWeek(selectedDate);
    updateCalendarHeaders(startOfWeek);
    updateCalendarBody(startOfWeek);
}

function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

function updateCalendarHeaders(startDate) {
    const headersRow = document.getElementById("calendar-headers").getElementsByTagName('th');
    for (let i = 1; i <= 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i - 1);
        headersRow[i].innerHTML = `${currentDate.toDateString().slice(0, 3)} (${currentDate.toISOString().split('T')[0]})`;
    }
}

function updateCalendarBody(startDate) {
    const body = document.getElementById("calendar-body");
    body.innerHTML = ''; // Clear previous content

    const employees = {};

    // Collect unique employees and their leave data
    leaveData.forEach(item => {
        const { employee, leave_date, type } = item;
        if (!employees[employee]) {
            employees[employee] = [];
        }
        employees[employee].push({ leave_date, type });
    });

    // Create rows for each employee
    Object.keys(employees).forEach(employee => {
        const employeeRow = document.createElement('tr');
        employeeRow.setAttribute("data-employee", employee);

        const employeeNameCell = document.createElement('td');
        employeeNameCell.textContent = employee;
        employeeRow.appendChild(employeeNameCell);

        for (let i = 1; i <= 7; i++) {
            const leaveCell = document.createElement('td');
            employeeRow.appendChild(leaveCell);
        }

        body.appendChild(employeeRow);
    });

    // Populate leave data into the calendar
    Object.keys(employees).forEach(employee => {
        const cells = body.querySelector(`tr[data-employee="${employee}"]`).getElementsByTagName("td");
        employees[employee].forEach(leave => {
            const [start, end] = leave.leave_date.split(" - ").map(d => {
                const [day, month, year] = d.split('/');
                return new Date(year, month - 1, day);
            });

            const startIndex = Math.max(1, Math.ceil((start - startDate) / (1000 * 60 * 60 * 24)) + 1);
            const endIndex = Math.min(7, Math.ceil((end - startDate) / (1000 * 60 * 60 * 24)) + 1);

            if (startIndex <= endIndex) {
                const leaveDiv = document.createElement('div');
                leaveDiv.className = 'leave';
                leaveDiv.innerHTML = `<span>${leave.type}</span>`;
                cells[startIndex].appendChild(leaveDiv);

                const updateLeaveDivWidth = () => {
                    const cellWidth = cells[startIndex].offsetWidth;
                    const spanWidth = (endIndex - startIndex + 1) * cellWidth - 50;
                    leaveDiv.style.width = `${spanWidth}px`;
                    leaveDiv.style.left = '0';
                };

                updateLeaveDivWidth();
                window.addEventListener('resize', updateLeaveDivWidth);
            }
        });
    });
}

function initializeCalendar() {
    const currentDate = new Date();
    const startOfWeek = getStartOfWeek(currentDate);
    const dateInput = document.getElementById("week-start");
    dateInput.value = startOfWeek.toISOString().split('T')[0];
    updateCalendarHeaders(startOfWeek);
    updateCalendarBody(startOfWeek);
}

// Initialize the calendar with the current week on page load
window.onload = initializeCalendar;