const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = HOURS_PER_DAY * 60;
const SECONDS_PER_DAY = MINUTES_PER_DAY * 60;
const MILLISECONDS_PER_DAY = SECONDS_PER_DAY * 1000;

let counter = {
  emptyContainers: 0,
  morningContainers: 0,
  middayContainers: 0,
  lateContainers: 0,
  zeroTimes: 0,
};

const COLUMN_INDEXES = {
  COUNTER: 0,
  STATUS: 1,
  IMP_EXP: 5,
  CUSTOMS: 6,
  DANGEROUS_GOODS: 7,
  WASTE: 8,
  IK_REFERENCE: 9,
  PICKUP_LOCATION: 11,
  CUSTOMER: 13,
  DEADLINE: 15,
  RETURN_LOCATION: 17,
  CONTAINER_TYPE: 19,
  CONTAINER_LENGTH: 20,
  CONTAINER_WEIGHT: 21,
  CONTAINER_NUMBER: 22,
};

const SELECTORS = {
  TOUR_DONE: 'img[title="In Bearbeitung"]',
  TOUR_OPEN: 'img[title="Angenommen"]',
  DATA: "#disptable>tbody",
  STATS_POS: "submenu-reverse",
  DATE_FROM: "UserSettings.DateFromStrings_Date",
  TIME_FROM: "UserSettings.DateFromStrings_Time",
  DATE_TO: "UserSettings.DateTillStrings_Date",
  TIME_TO: "UserSettings.DateTillStrings_Time",
  FORM_DATE: 'form[action="/Home/UpdateUserSettings"]',
  QUICKDATE_POS: 'input[value="Ansicht aktualisieren"]',
  SEARCH_KEYWORD: "SearchKeyword",
  SEARCH_BUTTON: 'input[value="Suchen"]',
};

insertClearSearchButton();
insertDateButtons();
setTitleToFilter();
processLines();

function setTitleToFilter() {
  const fromDate = toShortDate(
    document.getElementById(SELECTORS.DATE_FROM).value
  );
  const toDate = toShortDate(document.getElementById(SELECTORS.DATE_TO).value);
  const searchString = document.getElementById(SELECTORS.SEARCH_KEYWORD).value;
  let filter = searchString.length == 0 ? "" : " > " + searchString;
  let newTitle = `${fromDate} bis ${toDate}${filter}`;
  document.title = newTitle;
}

function toShortDate(date) {
  let [year, month, day] = date.split("-");
  return `${day}.${month}.`;
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
    document.getElementById(SELECTORS.SEARCH_KEYWORD).value = "";
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
      "tour_in_progress"
    );
  });

  document.querySelectorAll(SELECTORS.TOUR_OPEN).forEach((e) => {
    e.parentElement.parentElement.parentElement.parentElement.classList.add(
      "tour_todo"
    );
  });
  let rows = document.querySelectorAll(SELECTORS.DATA)[0].children;
  [...rows].forEach((row) => {
    [...row.children].forEach((e) => {
      styleEmptyContainer(e);
      styleEarlyDate(e);
      styleMiddleDate(e);
      styleLateDate(e);

      removeZeroTime(e);
    });
  });

  injectStatistics();
}

function removeZeroTime(e) {
  const re = /\d{2}\.\d{2}.\d{4}\s00:00<br>\s/gi;
  if (e.innerHTML.includes("00:00<br>")) {
    counter.zeroTimes++;
    e.innerHTML = e.innerHTML.replace(re, "");
  }
}

function styleEmptyContainer(e) {
  if (e.innerHTML.includes("<span>\nLE")) {
    e.parentElement.firstChild.classList.add("container_empty");
    counter.emptyContainers++;
  }
}

function styleEarlyDate(e) {
  const re = /0[5-9]:\d\d/gi;
  if (re.test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("tour_early");
    counter.morningContainers++;
  }
}

function styleMiddleDate(e) {
  const re = /1[01]:\d\d/gi;
  if (re.test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("tour_middle");
    counter.middayContainers++;
  }
}

function styleLateDate(e) {
  const re = /1[2-9]:\d\d/gi;
  if (e.innerHTML.includes("16:58") || e.innerHTML.includes("18:28")) {
    return;
  }

  if (re.test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("tour_late");
    counter.lateContainers++;
  }
}

function injectStatistics() {
  let stats = '<a href="#">';
  stats += '<span class="tour_early">';
  stats += counter.morningContainers;
  stats += "</span>";
  stats += '<span class="tour_middle">';
  stats += counter.middayContainers;
  stats += "</span>";
  stats += '<span class="tour_late">';
  stats += counter.lateContainers;
  stats += "</span>";
  stats += "&sum;";
  stats += "<span>";
  stats +=
    counter.morningContainers +
    counter.middayContainers +
    counter.lateContainers;
  stats += "</span>";
  stats += '<span class="container_empty">';
  stats += counter.emptyContainers;
  stats += "</span>";
  stats += "</a>";

  let elemStats = document.createElement("li");
  elemStats.innerHTML = stats;
  document
    .getElementsByClassName(SELECTORS.STATS_POS)[0]
    .appendChild(elemStats);
}

function getCurrentDate() {
  const day = addLeadingZeroToNumber(new Date().getDate());
  const month = addLeadingZeroToNumber(new Date().getMonth() + 1);
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

function addLeadingZeroToNumber(number) {
  if (number < 10) return "0" + number;
  else return number;
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

function setCurrentWeek() {
  const inDateFrom = document.getElementById(SELECTORS.DATE_FROM);
  const inDateTo = document.getElementById(SELECTORS.DATE_TO);
  const monday = getMonday();
  const friday = getFriday();
  inDateFrom.value = getStringFromDate(monday);
  inDateTo.value = getStringFromDate(friday);
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

function setCurrentDate() {
  const inDateFrom = document.getElementById(SELECTORS.DATE_FROM);
  const inDateTo = document.getElementById(SELECTORS.DATE_TO);

  const date = new Date();
  inDateFrom.value = getStringFromDate(date);
  inDateTo.value = inDateFrom.value;
}

function decrementDate() {
  const inDateFrom = document.getElementById(SELECTORS.DATE_FROM);
  const inDateTo = document.getElementById(SELECTORS.DATE_TO);

  const date = new Date(inDateFrom.value);
  let new_date = new Date(date.getTime() - MILLISECONDS_PER_DAY);
  while (!isWorkday(new_date)) {
    new_date = new Date(new_date.getTime() - MILLISECONDS_PER_DAY);
  }
  inDateFrom.value = getStringFromDate(new_date);
  inDateTo.value = inDateFrom.value;
}

function incrementDate() {
  const inDateFrom = document.getElementById(SELECTORS.DATE_FROM);
  const inDateTo = document.getElementById(SELECTORS.DATE_TO);

  const date = new Date(inDateFrom.value);
  let new_date = new Date(date.getTime() + MILLISECONDS_PER_DAY);
  while (!isWorkday(new_date)) {
    new_date = new Date(new_date.getTime() + MILLISECONDS_PER_DAY);
  }
  inDateFrom.value = getStringFromDate(new_date);
  inDateTo.value = inDateFrom.value;
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
