// Departure Date Calendar
function DepartureDate() {
    const calendar = new Date();
    let departureDate = null;
    const calendarControl = {
        localDate: new Date(),
        prevMonthLastDate: null,
        calWeekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        calMonthName: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ],
        daysInMonth: function (month, year) {
            return new Date(year, month, 0).getDate();
        },
        firstDay: function () {
            return new Date(calendar.getFullYear(), calendar.getMonth(), 1);
        },
        lastDay: function () {
            return new Date(calendar.getFullYear(), calendar.getMonth() + 1, 0);
        },
        firstDayNumber: function () {
            return calendarControl.firstDay().getDay() + 1;
        },
        lastDayNumber: function () {
            return calendarControl.lastDay().getDay() + 1;
        },
        getPreviousMonthLastDate: function () {
            let lastDate = new Date(
                calendar.getFullYear(),
                calendar.getMonth(),
                0
            ).getDate();
            return lastDate;
        },
        navigateToPreviousMonth: function () {
            calendar.setMonth(calendar.getMonth() - 1);
            calendarControl.attachEventsOnNextPrev();
        },
        navigateToNextMonth: function () {
            calendar.setMonth(calendar.getMonth() + 1);
            calendarControl.attachEventsOnNextPrev();
        },
        navigateToCurrentMonth: function () {
            let currentMonth = calendarControl.localDate.getMonth();
            let currentYear = calendarControl.localDate.getFullYear();
            calendar.setMonth(currentMonth);
            calendar.setYear(currentYear);
            calendarControl.attachEventsOnNextPrev();
        },
        displayYear: function () {
            let yearLabel = document.querySelector(".calendar .calendar-year-label");
            yearLabel.innerHTML = calendar.getFullYear();
        },
        displayMonth: function () {
            let monthLabel = document.querySelector(
                ".calendar .calendar-month-label"
            );
            monthLabel.innerHTML = calendarControl.calMonthName[calendar.getMonth()];
        },
        selectDate: function (e) {
            e.preventDefault();
            const selectedDate = new Date(
                calendar.getFullYear(),
                calendar.getMonth(),
                parseInt(e.target.textContent)
            );

            // Remove the "calendar-today" class from all date items
            const dateItems = document.querySelectorAll(".calendar .number-item");
            dateItems.forEach(item => item.classList.remove("calendar-today"));

            // Set the selected date as the departure date
            departureDate = selectedDate;

            // Add the "calendar-today" class to the clicked date
            e.target.parentElement.classList.add("calendar-today");

            // Update the departure date in the input placeholder which id is "departure-date"
            document.getElementById("departure_date").placeholder = `${selectedDate.toLocaleDateString()}`;
            console.log("Departure Date: " + selectedDate.toLocaleDateString());
        },
        plotSelectors: function () {
            const calendarElement = document.querySelector(".calendar");
            calendarElement.innerHTML = `<div class="calendar-inner"><div class="calendar-controls">
                <div class="calendar-prev"><a href="#" id="calendar-prev-button"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></a></div>
                <div class="calendar-year-month">
                    <div class="calendar-month-label"></div>
                    <div>-</div>
                    <div class="calendar-year-label"></div>
                </div>
                <div class="calendar-next"><a href="#" id="calendar-next-button"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></a></div>
            </div>
            <div class="calendar-today-date">Today: 
                ${calendarControl.calWeekDays[calendarControl.localDate.getDay()]}, 
                ${calendarControl.localDate.getDate()}, 
                ${calendarControl.calMonthName[calendarControl.localDate.getMonth()]} 
                ${calendarControl.localDate.getFullYear()}
            </div>
            <div class="calendar-body"></div>
            <hr class="calendar-bottom-line">
            <button class="calendar-close-button" onclick="closeDepartureCalendar()">Close</button>
            <br><br>
            </div>`;
        
            const prevMonthButton = document.getElementById("calendar-prev-button");
            const nextMonthButton = document.getElementById("calendar-next-button");
        
            prevMonthButton.addEventListener("click", function (e) {
                e.preventDefault();
                calendarControl.navigateToPreviousMonth();
            });
        
            nextMonthButton.addEventListener("click", function (e) {
                e.preventDefault();
                calendarControl.navigateToNextMonth();
            });
        },
        plotDayNames: function () {
            for (let i = 0; i < calendarControl.calWeekDays.length; i++) {
                document.querySelector(
                    ".calendar .calendar-body"
                ).innerHTML += `<div>${calendarControl.calWeekDays[i]}</div>`;
            }
        },
        plotDates: function () {
            document.querySelector(".calendar .calendar-body").innerHTML = "";
            calendarControl.plotDayNames();
            calendarControl.displayMonth();
            calendarControl.displayYear();
            let count = 1;
            let prevDateCount = 0;

            calendarControl.prevMonthLastDate = calendarControl.getPreviousMonthLastDate();
            let prevMonthDatesArray = [];
            let calendarDays = calendarControl.daysInMonth(
                calendar.getMonth() + 1,
                calendar.getFullYear()
            );
            // dates of current month
            for (let i = 1; i < calendarDays; i++) {
                if (i < calendarControl.firstDayNumber()) {
                    prevDateCount += 1;
                    document.querySelector(
                        ".calendar .calendar-body"
                    ).innerHTML += `<div class="prev-dates"></div>`;
                    prevMonthDatesArray.push(calendarControl.prevMonthLastDate--);
                } else {
                    document.querySelector(
                        ".calendar .calendar-body"
                    ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
                }
            }
            //remaining dates after month dates
            for (let j = 0; j < prevDateCount + 1; j++) {
                document.querySelector(
                    ".calendar .calendar-body"
                ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
            }
            calendarControl.highlightToday();
            calendarControl.plotPrevMonthDates(prevMonthDatesArray);
            calendarControl.plotNextMonthDates();
        },
        attachEvents: function () {
            let prevBtn = document.querySelector(".calendar .calendar-prev a");
            let nextBtn = document.querySelector(".calendar .calendar-next a");
            let todayDate = document.querySelector(".calendar .calendar-today-date");
            let dateNumber = document.querySelectorAll(".calendar .dateNumber");
            prevBtn.addEventListener(
                "click",
                calendarControl.navigateToPreviousMonth
            );
            nextBtn.addEventListener("click", calendarControl.navigateToNextMonth);
            todayDate.addEventListener(
                "click",
                calendarControl.navigateToCurrentMonth
            );
            for (var i = 0; i < dateNumber.length; i++) {
                dateNumber[i].addEventListener(
                    "click",
                    calendarControl.selectDate,
                    false
                );
            }
        },
        highlightToday: function () {
            let currentMonth = calendarControl.localDate.getMonth() + 1;
            let changedMonth = calendar.getMonth() + 1;
            let currentYear = calendarControl.localDate.getFullYear();
            let changedYear = calendar.getFullYear();
            if (
                currentYear === changedYear &&
                currentMonth === changedMonth &&
                document.querySelectorAll(".number-item")
            ) {
                document
                    .querySelectorAll(".number-item")
                [calendar.getDate() - 1].classList.add("calendar-today");
            }
        },
        plotPrevMonthDates: function (dates) {
            dates.reverse();
            for (let i = 0; i < dates.length; i++) {
                if (document.querySelectorAll(".prev-dates")) {
                    document.querySelectorAll(".prev-dates")[i].textContent = dates[i];
                }
            }
        },
        plotNextMonthDates: function () {
            let childElemCount = document.querySelector('.calendar-body').childElementCount;
            //7 lines
            if (childElemCount > 42) {
                let diff = 49 - childElemCount;
                calendarControl.loopThroughNextDays(diff);
            }

            //6 lines
            if (childElemCount > 35 && childElemCount <= 42) {
                let diff = 42 - childElemCount;
                calendarControl.loopThroughNextDays(42 - childElemCount);
            }

        },
        loopThroughNextDays: function (count) {
            if (count > 0) {
                for (let i = 1; i <= count; i++) {
                    document.querySelector('.calendar-body').innerHTML += `<div class="next-dates">${i}</div>`;
                }
            }
        },
        attachEventsOnNextPrev: function () {
            calendarControl.plotDates();
            calendarControl.attachEvents();
        },
        init: function () {
            calendarControl.plotSelectors();
            calendarControl.plotDates();
            calendarControl.attachEvents();
        }
    };
    calendarControl.init();
}


// Arrival Date Calendar
function ArrivalDate() {
    const calendar = new Date();
    let arrivalDate = null;
    const calendarControl2 = {
        localDate: new Date(),
        prevMonthLastDate: null,
        calWeekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        calMonthName: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ],
        daysInMonth: function (month, year) {
            return new Date(year, month, 0).getDate();
        },
        firstDay: function () {
            return new Date(calendar.getFullYear(), calendar.getMonth(), 1);
        },
        lastDay: function () {
            return new Date(calendar.getFullYear(), calendar.getMonth() + 1, 0);
        },
        firstDayNumber: function () {
            return calendarControl2.firstDay().getDay() + 1;
        },
        lastDayNumber: function () {
            return calendarControl2.lastDay().getDay() + 1;
        },
        getPreviousMonthLastDate: function () {
            let lastDate = new Date(
                calendar.getFullYear(),
                calendar.getMonth(),
                0
            ).getDate();
            return lastDate;
        },
        navigateToPreviousMonth: function () {
            calendar.setMonth(calendar.getMonth() - 1);
            calendarControl2.attachEventsOnNextPrev();
        },
        navigateToNextMonth: function () {
            calendar.setMonth(calendar.getMonth() + 1);
            calendarControl2.attachEventsOnNextPrev();
        },
        navigateToCurrentMonth: function () {
            let currentMonth = calendarControl2.localDate.getMonth();
            let currentYear = calendarControl2.localDate.getFullYear();
            calendar.setMonth(currentMonth);
            calendar.setYear(currentYear);
            calendarControl2.attachEventsOnNextPrev();
        },
        displayYear: function () {
            let yearLabel = document.querySelector(".calendar2 .calendar-year-label");
            yearLabel.innerHTML = calendar.getFullYear();
        },
        displayMonth: function () {
            let monthLabel = document.querySelector(
                ".calendar2 .calendar-month-label"
            );
            monthLabel.innerHTML = calendarControl2.calMonthName[calendar.getMonth()];
        },
        selectDate: function (e) {
            e.preventDefault();
            const selectedDate = new Date(
                calendar.getFullYear(),
                calendar.getMonth(),
                parseInt(e.target.textContent)
            );

            // Remove the "calendar-today" class from all date items
            const dateItems = document.querySelectorAll(".calendar2 .number-item");
            dateItems.forEach(item => item.classList.remove("calendar-today"));

            // Set the selected date as the arrival date
            arrivalDate = selectedDate;

            // Add the "calendar-today" class to the clicked date
            e.target.parentElement.classList.add("calendar-today");

            // Update the arrival date in the input placeholder which id is "arrival_date"
            document.getElementById("arrival_date").placeholder = `${selectedDate.toLocaleDateString()}`;
        },
        plotSelectors: function () {
            const calendarElement = document.querySelector(".calendar2");
            calendarElement.innerHTML = `<div class="calendar-inner2"><div class="calendar-controls">
                <div class="calendar-prev"><a href="#" id="calendar-prev-button"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></a></div>
                <div class="calendar-year-month">
                    <div class="calendar-month-label"></div>
                    <div>-</div>
                    <div class="calendar-year-label"></div>
                </div>
                <div class="calendar-next"><a href="#" id="calendar-next-button"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></a></div>
            </div>
            <div class="calendar-today-date">Today: 
                ${calendarControl2.calWeekDays[calendarControl2.localDate.getDay()]}, 
                ${calendarControl2.localDate.getDate()}, 
                ${calendarControl2.calMonthName[calendarControl2.localDate.getMonth()]} 
                ${calendarControl2.localDate.getFullYear()}
            </div>
            <div class="calendar-body"></div>
            <hr class="calendar-bottom-line">
            <button class="calendar-close-button" onclick="closeArrivalCalendar()">Close</button>
            <br><br>
            </div>`;

            const prevMonthButton = document.getElementById("calendar-prev-button");
            const nextMonthButton = document.getElementById("calendar-next-button");

            prevMonthButton.addEventListener("click", function (e) {
                e.preventDefault();
                calendarControl2.navigateToPreviousMonth();
            });

            nextMonthButton.addEventListener("click", function (e) {
                e.preventDefault();
                calendarControl2.navigateToNextMonth();
            });
        },

        plotDayNames: function () {
            for (let i = 0; i < calendarControl2.calWeekDays.length; i++) {
                document.querySelector(
                    ".calendar2 .calendar-body"
                ).innerHTML += `<div>${calendarControl2.calWeekDays[i]}</div>`;
            }
        },
        plotDates: function () {
            document.querySelector(".calendar2 .calendar-body").innerHTML = "";
            calendarControl2.plotDayNames();
            calendarControl2.displayMonth();
            calendarControl2.displayYear();
            let count = 1;
            let prevDateCount = 0;

            calendarControl2.prevMonthLastDate = calendarControl2.getPreviousMonthLastDate();
            let prevMonthDatesArray = [];
            let calendarDays = calendarControl2.daysInMonth(
                calendar.getMonth() + 1,
                calendar.getFullYear()
            );
            // dates of current month
            for (let i = 1; i < calendarDays; i++) {
                if (i < calendarControl2.firstDayNumber()) {
                    prevDateCount += 1;
                    document.querySelector(
                        ".calendar2 .calendar-body"
                    ).innerHTML += `<div class="prev-dates"></div>`;
                    prevMonthDatesArray.push(calendarControl2.prevMonthLastDate--);
                } else {
                    document.querySelector(
                        ".calendar2 .calendar-body"
                    ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
                }
            }
            //remaining dates after month dates
            for (let j = 0; j < prevDateCount + 1; j++) {
                document.querySelector(
                    ".calendar2 .calendar-body"
                ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
            }
            calendarControl2.highlightToday();
            calendarControl2.plotPrevMonthDates(prevMonthDatesArray);
            calendarControl2.plotNextMonthDates();
        },
        attachEvents: function () {
            let prevBtn = document.querySelector(".calendar2 .calendar-prev a");
            let nextBtn = document.querySelector(".calendar2 .calendar-next a");
            let todayDate = document.querySelector(".calendar2 .calendar-today-date");
            let dateNumber = document.querySelectorAll(".calendar2 .dateNumber");
            prevBtn.addEventListener(
                "click",
                calendarControl2.navigateToPreviousMonth
            );
            nextBtn.addEventListener("click", calendarControl2.navigateToNextMonth);
            todayDate.addEventListener(
                "click",
                calendarControl2.navigateToCurrentMonth
            );
            for (var i = 0; i < dateNumber.length; i++) {
                dateNumber[i].addEventListener(
                    "click",
                    calendarControl2.selectDate,
                    false
                );
            }
        },
        highlightToday: function () {
            let currentMonth = calendarControl2.localDate.getMonth() + 1;
            let changedMonth = calendar.getMonth() + 1;
            let currentYear = calendarControl2.localDate.getFullYear();
            let changedYear = calendar.getFullYear();
            if (
                currentYear === changedYear &&
                currentMonth === changedMonth &&
                document.querySelectorAll(".number-item")
            ) {
                document
                    .querySelectorAll(".number-item")
                [calendar.getDate() - 1].classList.add("calendar-today");
            }
        },
        plotPrevMonthDates: function (dates) {
            dates.reverse();
            for (let i = 0; i < dates.length; i++) {
                if (document.querySelectorAll(".prev-dates")) {
                    document.querySelectorAll(".prev-dates")[i].textContent = dates[i];
                }
            }
        },
        plotNextMonthDates: function () {
            let childElemCount = document.querySelector('.calendar-body').childElementCount;
            //7 lines
            if (childElemCount > 42) {
                let diff = 49 - childElemCount;
                calendarControl2.loopThroughNextDays(diff);
            }

            //6 lines
            if (childElemCount > 35 && childElemCount <= 42) {
                let diff = 42 - childElemCount;
                calendarControl2.loopThroughNextDays(42 - childElemCount);
            }

        },
        loopThroughNextDays: function (count) {
            if (count > 0) {
                for (let i = 1; i <= count; i++) {
                    document.querySelector('.calendar-body').innerHTML += `<div class="next-dates">${i}</div>`;
                }
            }
        },
        attachEventsOnNextPrev: function () {
            calendarControl2.plotDates();
            calendarControl2.attachEvents();
        },
        init: function () {
            calendarControl2.plotSelectors();
            calendarControl2.plotDates();
            calendarControl2.attachEvents();
        }
    };
    calendarControl2.init();
}

// to variable
const calendarControl = new DepartureDate();
const calendarControl2 = new ArrivalDate();

// Toggles
function departureDateToggle() {
    console.log("test 1");
    const departureToggle = document.querySelector('.calendar');
    const arrivalToggle = document.querySelector('.calendar2');
    if (departureToggle.style.display === "none") {
        departureToggle.style.display = "block";
        arrivalToggle.style.display = "none";
    } else {
        departureToggle.style.display = "none";
    }
}

function arrivalDateToggle() {
    console.log("test 2");
    const departureToggle = document.querySelector('.calendar');
    const arrivalToggle = document.querySelector('.calendar2');
    if (arrivalToggle.style.display === "none") {
        arrivalToggle.style.display = "block";
        departureToggle.style.display = "none";
    } else {
        arrivalToggle.style.display = "none";
    }
}

// Close Calendar
function closeDepartureCalendar() {
    const departureToggle = document.querySelector('.calendar');
    departureToggle.style.display = "none";
}

function closeArrivalCalendar() {
    const arrivalToggle = document.querySelector('.calendar2');
    arrivalToggle.style.display = "none";
}