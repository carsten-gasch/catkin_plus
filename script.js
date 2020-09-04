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

insertDateButtons();
processLines();

//offene und vergebene Aufträge markieren
document.querySelectorAll('img[title="In Bearbeitung"]').forEach((e) => {
  e.parentElement.parentElement.parentElement.parentElement.classList.add(
    "in_bearbeitung"
  );
});

document.querySelectorAll('img[title="Angenommen"]').forEach((e) => {
  e.parentElement.parentElement.parentElement.parentElement.classList.add(
    "angenommen"
  );
});

function processLines() {
  let rows = document.querySelectorAll("#disptable>tbody")[0].children;
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
    e.parentElement.firstChild.classList.add("leercontainer");
    counter.emptyContainers++;
  }
}

function styleEarlyDate(e) {
  const re = /0[5-9]:\d\d/gi;
  if (re.test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("fruehtermin");
    counter.morningContainers++;
  }
}

function styleMiddleDate(e) {
  const re = /1[01]:\d\d/gi;
  if (re.test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("mittagstermin");
    counter.middayContainers++;
  }
}

function styleLateDate(e) {
  const re = /1[2-9]:\d\d/gi;
  if (e.innerHTML.includes("16:58") || e.innerHTML.includes("18:28")) {
    return;
  }

  if (re.test(e.innerHTML)) {
    e.parentElement.firstChild.classList.add("spaettermin");
    counter.lateContainers++;
  }
}

function injectStatistics() {
  let stats = '<a href="#">';
  stats += '<span class="fruehtermin">';
  stats += counter.morningContainers;
  stats += "</span>";
  stats += '<span class="mittagstermin">';
  stats += counter.middayContainers;
  stats += "</span>";
  stats += '<span class="spaettermin">';
  stats += counter.lateContainers;
  stats += "</span>";
  stats += "&sum;";
  stats += "<span>";
  stats +=
    counter.morningContainers +
    counter.middayContainers +
    counter.lateContainers;
  stats += "</span>";
  stats += '<span class="leercontainer">';
  stats += counter.emptyContainers;
  stats += "</span>";
  stats += "</a>";

  let elemStats = document.createElement("li");
  elemStats.innerHTML = stats;
  document.getElementsByClassName("submenu-reverse")[0].appendChild(elemStats);
}

function getCurrentDate() {
  const day = addLeadingZeroToNumber(new Date().getDate());
  const month = addLeadingZeroToNumber(new Date().getMonth() + 1);
  const year = new Date().getFullYear();
  return { year: year, month: month, day: day };
}

function insertYesterdayButton() {
  let today = getCurrentDate();

  const inputFromDate = document.getElementById(
    "UserSettings.DateFromStrings_Date"
  );
  const inputFromTime = document.getElementById(
    "UserSettings.DateFromStrings_Time"
  );
  const inputToDate = document.getElementById(
    "UserSettings.DateTillStrings_Date"
  );
  const inputToTime = document.getElementById(
    "UserSettings.DateTillStrings_Time"
  );
  const formElement = document.querySelector(
    'form[action="/Home/UpdateUserSettings"]'
  );

  const btnYesterday = document.createElement("button");
  btnYesterday.innerHTML = "&larr;";
  btnYesterday.title = "zeige letzten Tag";
  btnYesterday.addEventListener("click", () => {
    /*
    inputFromDate.value = today.year + "-" + today.month + "-" + today.day;
    inputFromTime.value = "00:01";
    inputToDate.value = today.year + "-" + today.month + "-" + today.day;
    inputToTime.value = "23:59";

    formElement.submit();
    */
    console.info("not yet implemented");
  });
  return btnYesterday;
}

function insertTodayButton() {
  const today = getCurrentDate();

  const inputFromDate = document.getElementById(
    "UserSettings.DateFromStrings_Date"
  );
  const inputFromTime = document.getElementById(
    "UserSettings.DateFromStrings_Time"
  );
  const inputToDate = document.getElementById(
    "UserSettings.DateTillStrings_Date"
  );
  const inputToTime = document.getElementById(
    "UserSettings.DateTillStrings_Time"
  );
  const formElement = document.querySelector(
    'form[action="/Home/UpdateUserSettings"]'
  );

  const btnToday = document.createElement("button");
  btnToday.innerHTML = "&uarr;";
  btnToday.title = "zeige heutigen Tag";
  btnToday.addEventListener("click", () => {
    inputFromDate.value = today.year + "-" + today.month + "-" + today.day;
    inputFromTime.value = "00:01";
    inputToDate.value = today.year + "-" + today.month + "-" + today.day;
    inputToTime.value = "23:59";

    formElement.submit();
  });
  return btnToday;
}

function insertTomorrowButton() {
  let today = getCurrentDate();

  const inputFromDate = document.getElementById(
    "UserSettings.DateFromStrings_Date"
  );
  const inputFromTime = document.getElementById(
    "UserSettings.DateFromStrings_Time"
  );
  const inputToDate = document.getElementById(
    "UserSettings.DateTillStrings_Date"
  );
  const inputToTime = document.getElementById(
    "UserSettings.DateTillStrings_Time"
  );
  const formElement = document.querySelector(
    'form[action="/Home/UpdateUserSettings"]'
  );

  const btnTomorrow = document.createElement("button");
  btnTomorrow.innerHTML = "&rarr;";
  btnTomorrow.title = "zeige morgigen Tag";
  btnTomorrow.addEventListener("click", () => {
    /*
    inputFromDate.value = today.year + "-" + today.month + "-" + today.day;
    inputFromTime.value = "00:01";
    inputToDate.value = today.year + "-" + today.month + "-" + today.day;
    inputToTime.value = "23:59";

    formElement.submit();
    */

    console.info("not yet implemented");
  });
  return btnTomorrow;
}

function insertThisWeekButton() {
  let today = getCurrentDate();

  const inputFromDate = document.getElementById(
    "UserSettings.DateFromStrings_Date"
  );
  const inputFromTime = document.getElementById(
    "UserSettings.DateFromStrings_Time"
  );
  const inputToDate = document.getElementById(
    "UserSettings.DateTillStrings_Date"
  );
  const inputToTime = document.getElementById(
    "UserSettings.DateTillStrings_Time"
  );
  const formElement = document.querySelector(
    'form[action="/Home/UpdateUserSettings"]'
  );

  const btnThisWeek = document.createElement("button");
  btnThisWeek.innerHTML = "&harr;";
  btnThisWeek.title = "zeige aktuelle Woche";
  btnThisWeek.addEventListener("click", () => {
    /*
    inputFromDate.value = today.year + "-" + today.month + "-" + today.day;
    inputFromTime.value = "00:01";
    inputToDate.value = today.year + "-" + today.month + "-" + today.day;
    inputToTime.value = "23:59";

    formElement.submit();
    */

    console.info("not yet implemented");
  });
  return btnThisWeek;
}

function addLeadingZeroToNumber(number) {
  if (number < 10) return "0" + number;
  else return number;
}

function insertDateButtons() {
  const insertIntoElement = document.querySelector(
    'input[value="Ansicht aktualisieren"]'
  );

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
