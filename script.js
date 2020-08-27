let counter = {
  emptyContainers: 0,
  morningContainers: 0,
  middayContainers: 0,
  lateContainers: 0,
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
    });
  });

  injectStatistics();
}

function styleEmptyContainer(e) {
  if (e.innerHTML.includes("<span>\nLE")) {
    e.parentElement.firstChild.classList.add("leercontainer");
    counter.emptyContainers++;
  }
}

function styleEarlyDate(e) {
  if (
    e.innerHTML.includes("05:") ||
    e.innerHTML.includes("06:") ||
    e.innerHTML.includes("07:") ||
    e.innerHTML.includes("08:") ||
    e.innerHTML.includes("09:")
  ) {
    e.parentElement.firstChild.classList.add("fruehtermin");
    counter.morningContainers++;
  }
}

function styleMiddleDate(e) {
  if (e.innerHTML.includes("10:") || e.innerHTML.includes("11:")) {
    e.parentElement.firstChild.classList.add("mittagstermin");
    counter.middayContainers++;
  }
}

function styleLateDate(e) {
  if (e.innerHTML.includes("16:58") || e.innerHTML.includes("18:28")) {
    return;
  }

  if (
    e.innerHTML.includes("12:") ||
    e.innerHTML.includes("13:") ||
    e.innerHTML.includes("14:") ||
    e.innerHTML.includes("15:") ||
    e.innerHTML.includes("16:") ||
    e.innerHTML.includes("17:") ||
    e.innerHTML.includes("18:") ||
    e.innerHTML.includes("19:")
  ) {
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
