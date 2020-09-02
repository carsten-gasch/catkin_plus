let counter = {
  emptyContainers: 0,
  morningContainers: 0,
  middayContainers: 0,
  lateContainers: 0,
  zeroTimes: 0,
};

const COUNTER = 0;
const STATUS = 1;
const IMP_EXP = 5;
const CUSTOMS = 6;
const DANGEROUS_GOODS = 7;
const WASTE = 8;
const IK_REFERENCE = 9;
const PICKUP_LOCATION = 11;
const CUSTOMER = 13;
const DEADLINE = 15;
const RETURN_LOCATION = 17;
const CONTAINER_TYPE = 19;
const CONTAINER_LENGTH = 20;
const CONTAINER_WEIGHT = 21;
const CONTAINER_NUMBER = 22;

insertTodayButton();
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
      console.log("00:00 => " + counter.zeroTimes);
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

function insertTodayButton() {
  const day = addLeadingZero(new Date().getDate());
  const month = addLeadingZero(new Date().getMonth()+1);
  const year = new Date().getFullYear();

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
  const insertBefore = document.querySelector(
    'input[value="Ansicht aktualisieren"]'
  );

  const btnToday = document.createElement("button");
  btnToday.innerText = "heute";
  btnToday.addEventListener("click", () => {
    inputFromDate.value = year + "-" + month + "-" + day;
    inputFromTime.value = "00:01";
    inputToDate.value = year + "-" + month + "-" + day;
    inputToTime.value = "23:59";

    formElement.submit();
  });
  insertBefore.parentElement.appendChild(btnToday);
}

function addLeadingZero(number) {
  if (number < 10) return "0" + number;
  else return number;
}
