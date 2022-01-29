function parseHTMLTableElem(tableEl) {
  const columns = Array.from(tableEl.querySelectorAll('th')).map(it => it.textContent)
  const rows = tableEl.querySelectorAll('tbody > tr')
  return Array.from(rows).map(row => {
      const cells = Array.from(row.querySelectorAll('td'))
      return columns.reduce((obj, col, idx) => {
          obj[col] = cells[idx].textContent
          return obj
      }, {})
  })
}

let counter = {
  emptyContainers: 0,
  earlyContainers: 0,
  morningContainers: 0,
  afternoonContainers: 0,
  eveningContainers: 0,
  zeroTimes: 0,
};

const currentTerminal = document
  .querySelector(SELECTORS.SELECTED_TERMINAL)
  .innerText.match(new RegExp(REGEXES.TERMINAL, "gi"))[0];

// Terminal specific stuff
switch (currentTerminal) {
  case "Leipzig":
    addCheckboxes();
    break;
  default:
    break;
}

//let the magic happen
insertClearSearchButton();
insertClearDateAndTimeButton();
insertDateButtons();
setTitleToFilter();
processLines();

function addCheckboxes() {
  let counters = document.querySelectorAll(".css-increment");
  counters.forEach((e) => {
    let cb = document.createElement("input");
    cb.type = "checkbox";
    e.appendChild(cb);
  });
}

function setTitleToFilter() {
  const fromDate = toShortDate(
    document.getElementById(SELECTORS.DATE_FROM).value
  );
  const toDate = toShortDate(document.getElementById(SELECTORS.DATE_TO).value);
  const searchString = document.querySelector(SELECTORS.SEARCH_KEYWORD).value;
  let filter = "";
  if (searchString.length > 0) {
    filter += " > " + searchString;
  }
  let newTitle = `${fromDate} bis ${toDate}${filter}`;
  document.title = newTitle;
}

function insertClearDateAndTimeButton() {
  const clearDateAndTimeButton = document.createElement("button");
  clearDateAndTimeButton.innerHTML = "&cross;";
  clearDateAndTimeButton.title = "Tag und zeit löschen";
  clearDateAndTimeButton.classList.add("btn");
  clearDateAndTimeButton.classList.add("btn-success");
  clearDateAndTimeButton.classList.add("btn-sm");
  clearDateAndTimeButton.style.backgroundColor = "red";
  clearDateAndTimeButton.style.borderColor = "red";
  clearDateAndTimeButton.addEventListener("click", () => {
    document.getElementById(SELECTORS.DATE_FROM).value = "";
    document.getElementById(SELECTORS.TIME_FROM).value = "";
    document.getElementById(SELECTORS.DATE_TO).value = "";
    document.getElementById(SELECTORS.TIME_TO).value = "";
    return false;
  });
  document
    .getElementById(SELECTORS.TIME_TO)
    .parentElement.appendChild(clearDateAndTimeButton);
}

function insertClearSearchButton() {
  const clearSearchButton = document.createElement("button");
  clearSearchButton.innerHTML = "&cross;";
  clearSearchButton.title = "Suche löschen";
  clearSearchButton.classList.add("btn");
  clearSearchButton.classList.add("btn-success");
  clearSearchButton.classList.add("btn-sm");
  clearSearchButton.style.backgroundColor = "red";
  clearSearchButton.style.borderColor = "red";
  clearSearchButton.addEventListener("click", () => {
    document.querySelector(SELECTORS.SEARCH_KEYWORD).value = "";
    document.querySelector(SELECTORS.SEARCH_BUTTON).click();
  });
  document
    .querySelector(SELECTORS.SEARCH_BUTTON)
    .parentElement.appendChild(clearSearchButton);
}

function processLines() {
  //offene und vergebene Aufträge markieren
  document.querySelectorAll(SELECTORS.TOUR_DONE).forEach((e) => {
    e.parentElement.parentElement.parentElement.parentElement.classList.add(
      "tour_in_process"
    );
  });

  document.querySelectorAll(SELECTORS.TOUR_OPEN).forEach((e) => {
    e.parentElement.parentElement.parentElement.parentElement.classList.add(
      "tour_confirmed"
    );
  });
  let rows = document.querySelector(SELECTORS.DATA).children;
  [...rows].forEach((row) => {
    [...row.children].forEach((e) => {
      styleEmptyContainer(e);
      styleEarlyDate(e);
      styleMorningDate(e);
      styleAfternoonDate(e);
      styleEveningDate(e);

      //removeZeroTime(e);
    });
  });

  injectStatistics();
}

function removeZeroTime(e) {
  if (e.innerHTML.includes("00:00<br>")) {
    counter.zeroTimes++;
    e.innerHTML = e.innerHTML.replace(new RegExp(REGEXES.TIME_ZERO, "gi"), "");
  }
}

function styleEmptyContainer(e) {
  if (new RegExp(REGEXES.EMPTY_CONTAINER, "gi").test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("container_empty");
    counter.emptyContainers++;
  }
}

function styleEarlyDate(e) {
  if (new RegExp(REGEXES.APPOINTMENT_EARLY, "gi").test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("tour_early");
    counter.earlyContainers++;
  }
}

function styleMorningDate(e) {
  if (new RegExp(REGEXES.APPOINTMENT_MORNING, "gi").test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("tour_morning");
    counter.morningContainers++;
  }
}

function styleAfternoonDate(e) {
  if (new RegExp(REGEXES.APPOINTMENT_AFTERNOON, "gi").test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("tour_afternoon");
    counter.afternoonContainers++;
  }
}

function styleEveningDate(e) {
  if (new RegExp(REGEXES.APPOINTMENT_EVENING, "gi").test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("tour_evening");
    counter.eveningContainers++;
  }
}

function injectStatistics() {
  const a = document.createElement("a");
  a.href = "";

  const early = document.createElement("span");
  early.classList.add("tour_early");
  early.innerText = counter.earlyContainers;

  const morning = document.createElement("span");
  morning.classList.add("tour_morning");
  morning.innerText = counter.morningContainers;

  const afternoon = document.createElement("span");
  afternoon.classList.add("tour_afternoon");
  afternoon.innerText = counter.afternoonContainers;

  const evening = document.createElement("span");
  evening.classList.add("tour_evening");
  evening.innerText = counter.eveningContainers;

  const sumSign = document.createElement("span");
  sumSign.innerHTML = "&sum;";

  const sum = document.createElement("span");
  sum.innerHTML =
    counter.earlyContainers +
    counter.morningContainers +
    counter.afternoonContainers +
    counter.eveningContainers;

  const empty = document.createElement("span");
  empty.classList.add("container_empty");
  empty.innerText = counter.emptyContainers;

  a.appendChild(early);
  a.appendChild(morning);
  a.appendChild(afternoon);
  a.appendChild(evening);
  a.appendChild(sumSign);
  a.appendChild(sum);
  a.appendChild(empty);

  const elemStats = document.createElement("li");
  elemStats.appendChild(a);
  document
    .querySelector(SELECTORS.STATS_POS)
    .appendChild(elemStats);
}

function getCurrentDate() {
  const day = new String(addLeadingZero(new Date().getDate()));
  const month = new String(addLeadingZero(new Date().getMonth() + 1));
  const year = new Date().getFullYear();
  return { year: year, month: month, day: day };
}

function insertYesterdayButton() {
  const btnYesterday = document.createElement("button");
  btnYesterday.innerHTML = "&larr;";
  btnYesterday.title = "zeige letzten Tag";
  btnYesterday.addEventListener("click", decrementDate);
  return btnYesterday;
}

function insertTodayButton() {
  const btnToday = document.createElement("button");
  btnToday.innerHTML = "&uarr;";
  btnToday.title = "zeige heutigen Tag";
  btnToday.addEventListener("click", setCurrentDate);
  return btnToday;
}

function insertTomorrowButton() {
  const btnTomorrow = document.createElement("button");
  btnTomorrow.innerHTML = "&rarr;";
  btnTomorrow.title = "zeige morgigen Tag";
  btnTomorrow.addEventListener("click", incrementDate);
  return btnTomorrow;
}

function insertThisWeekButton() {
  const btnThisWeek = document.createElement("button");
  btnThisWeek.innerHTML = "&harr;";
  btnThisWeek.title = "zeige aktuelle Woche";
  btnThisWeek.addEventListener("click", setCurrentWeek);
  return btnThisWeek;
}

function insertDateButtons() {
  const insertIntoElement = document.querySelector(SELECTORS.QUICKDATE_POS);

  const btnYesterday = insertYesterdayButton();
  const btnToday = insertTodayButton();
  const btnTomorrow = insertTomorrowButton();
  const btnWeek = insertThisWeekButton();

  const container = document.createElement("div");
  container.id = "quickDate";
  container.appendChild(btnYesterday);
  container.appendChild(btnToday);
  container.appendChild(btnTomorrow);
  container.appendChild(btnWeek);

  insertIntoElement.parentElement.appendChild(container);
}

function setCurrentDate() {
  const date = new Date();
  inDateFrom.value = getStringFromDate(date);
  inDateTo.value = inDateFrom.value;
  inTimeFrom.value="00:00";
  inTimeTo.value="23:59";
}

function decrementDate() {

  const date = new Date(inDateFrom.value);
  let new_date = new Date(date.getTime() - MILLISECONDS_PER_DAY);
  while (!isWorkday(new_date)) {
    new_date = new Date(new_date.getTime() - MILLISECONDS_PER_DAY);
  }
  inDateFrom.value = getStringFromDate(new_date);
  inDateTo.value = inDateFrom.value;
}

function incrementDate() {
  const date = new Date(inDateFrom.value);
  let new_date = new Date(date.getTime() + MILLISECONDS_PER_DAY);
  while (!isWorkday(new_date)) {
    new_date = new Date(new_date.getTime() + MILLISECONDS_PER_DAY);
  }
  inDateFrom.value = getStringFromDate(new_date);
  inDateTo.value = inDateFrom.value;
}

function setCurrentWeek() {
  const monday = getMonday();
  const friday = getFriday();
  inDateFrom.value = getStringFromDate(monday);
  inDateTo.value = getStringFromDate(friday);
}

function getStringFromDate(date) {
  let ret = date.getFullYear();
  ret += "-";
  ret += addLeadingZero(date.getMonth() + 1);
  ret += "-";
  ret += addLeadingZero(date.getDate());

  return ret;
}

function addLeadingZero(number) {
  if (number < 10) return "0" + number;
  else return new String(number);
}

function isWorkday(date) {
  const day = date.getDay();
  if (day == 0 || day == 6) return false;
  else return true;
}

function getMonday() {
  let date = new Date();
  while (date.getDay() != 1) {
    date = new Date(date.getTime() - MILLISECONDS_PER_DAY);
  }
  return date;
}

function getFriday() {
  let date = new Date();
  if (date.getDay() == 6) date = new Date(date - MILLISECONDS_PER_DAY);
  if (date.getDay() == 0) date = new Date(date - 2 * MILLISECONDS_PER_DAY);
  while (date.getDay() != 5) {
    date = new Date(date.getTime() + MILLISECONDS_PER_DAY);
  }
  return date;
}

function toShortDate(date) {
  let [year, month, day] = date.split("-");
  return `${day}.${month}.`;
}
