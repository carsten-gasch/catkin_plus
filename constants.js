const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = HOURS_PER_DAY * 60;
const SECONDS_PER_DAY = MINUTES_PER_DAY * 60;
const MILLISECONDS_PER_DAY = SECONDS_PER_DAY * 1000;

const COLUMN_INDEXES = {
  COUNTER: 0,
  STATUS: 1,
  ID: 2,
  TYPE: 3,
  CUSTOMS: 4,
  IMO: 5,
  WASTE: 6,
  IK: 7,
  AMOUNT_ADDRESSES: 8,
  PICKUP_ADDRESS: 9,
  PICKUP_REFERENCE: 10,
  CONTAINERNUMBER: 11,
  REEDER: 12,
  CONTAINER_SIZE: 13,
  CONTAINER_TYPE: 14,
  APPOINTMENT: 15,
  LOADING_REFERENCE: 16,
  LOADING_ADDRESS: 17,
  DROPOFF_ADDRESS: 18,
  DROPOFF_REFERENCE: 19,
  WEIGHT: 20,
  PRICE: 21,
  TRUCKING_COMPANY: 22,
  TRUCK: 23,
  ACTIONS: 24,
};

const SELECTORS = {
  TOUR_DONE: "img[title=\"In Bearbeitung\"]",
  TOUR_OPEN: "img[title=\"Angenommen\"]",
  DATA: "#disptable>tbody",
  STATS_POS: ".submenu-reverse",
  DATE_FROM: "UserSettings_DateFromStrings_Date",
  TIME_FROM: "UserSettings.DateFromStrings_Time",
  DATE_TO: "UserSettings_DateTillStrings_Date",
  TIME_TO: "UserSettings_DateTillStrings_Time",
  FORM_DATE: "form[action=\"/Home/UpdateUserSettings\"]",
  QUICKDATE_POS: ".title input[type=\"submit\"]",
  SEARCH_KEYWORD: "#SearchKeyword",
  SEARCH_BUTTON: "input[type=\"submit\"].btn-sm",
  POSITION_FOR_CHECKBOXES: ".css-increment",
  SELECTED_TERMINAL: ".changegroup > option[selected]",
};

const REGEXES = {
  TERMINAL: "[\\w]+",
  TIME_ZERO: "\\d{2}.\\d{2}.\\d{4}\\s00:00<br>\\s",
  APPOINTMENT_EARLY: "0[5-9]:\\d\\d",
  APPOINTMENT_MORNING: "1[01]:\\d\\d",
  APPOINTMENT_AFTERNOON: "1[2-4]:\\d\\d",
  APPOINTMENT_EVENING: "(1[5-9]|20|21):\\d\\d",
  EMPTY_CONTAINER: "\\sLE\\s",
};

const inDateFrom = document.getElementById(SELECTORS.DATE_FROM);
const inDateTo = document.getElementById(SELECTORS.DATE_TO);
const inTimeFrom = document.getElementById(SELECTORS.TIME_FROM);
const inTimeTo = document.getElementById(SELECTORS.TIME_TO);
