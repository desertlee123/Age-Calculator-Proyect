/* GRAB DOCUMENTS ELEMENTS */
const form = document.getElementById("form");
const selectDays = document.getElementById("select-days");
const selectMonths = document.getElementById("select-months");
const selectYears = document.getElementById("select-years");
const submitButton = document.getElementById("submit-button");
const containerResult = document.getElementById("container-result");
const messageParagraph = document.getElementById("message-paragraph");
const deleteButton = document.getElementById("delete-button");

/* INSTANCE OBJECT DATE AND GET DATE DATA (DAY, MONTH, YEAR) */
const DATE = new Date();
const [CURRENT_DATE, CURRENT_MONTH, CURRENT_YEAR] = [
  DATE.getDate(),
  DATE.getMonth() + 1,
  DATE.getFullYear(),
];

/* FUNCTION TO CALCULATE AGE IN YEARS, MONTHS AND DAYS */
let calculateAge = (inputDate, inputMonth, inputYear) => {
  let totalDays = new Date(inputYear, inputMonth, 0).getDate(); // Get the days mount of specific month

  let age = CURRENT_YEAR - inputYear; // Get age in years

  let monthsElapsed = 12 - inputMonth + CURRENT_MONTH; // Get elapsed months
  let ageInInMonths =
    inputMonth <= CURRENT_MONTH ? monthsElapsed - 12 : monthsElapsed; // Get the age in months by checking if the input month has already passed

  let ageInDays =
    inputDate >= CURRENT_DATE
      ? totalDays - inputDate + CURRENT_DATE
      : CURRENT_DATE - inputDate; // Get age in days by checking the elapsed days

  if (inputDate > CURRENT_DATE && inputMonth === CURRENT_MONTH) {
    age--;
    ageInInMonths = 11;
  }
  if (CURRENT_MONTH < inputMonth) age--;
  if (CURRENT_DATE < inputDate && inputMonth !== CURRENT_MONTH) ageInInMonths--;
  if (inputDate === CURRENT_DATE) ageInDays = 0;
  // Modifiyng the variables to show the correct result

  let invalidInputs =
    (inputDate < CURRENT_DATE &&
      inputMonth > CURRENT_MONTH &&
      inputYear === CURRENT_YEAR) ||
    (inputDate >= CURRENT_DATE &&
      inputMonth >= CURRENT_MONTH &&
      inputYear >= CURRENT_YEAR);
  return invalidInputs
    ? "Inconclusive"
    : `Your age is ${age} year${age > 1 ? "s" : ""} ${ageInInMonths} month${
        ageInInMonths > 1 ? "s" : ""
      } ${ageInDays} day${ageInDays > 1 ? "s" : ""}`; // Returns the final message by validating the inputs
};

let currentDaySelected = null;
let lastDaySelected = null;

selectDays.addEventListener(
  "change",
  (e) => (currentDaySelected = parseInt(e.target.value) - 1)
); // Capture of the day selected by the user and saved in the variable "currentDaySelected"

/* FUNCTION TO LOAD THE DAYS DEPENDING ON THE MONTH AND YEAR SELECTED */
let loadDays = (yearValue = CURRENT_YEAR, monthValue = CURRENT_MONTH) => {
  let totalDays = new Date(yearValue, monthValue, 0).getDate(); // Get the days mount of specific month

  let fragmentDays = document.createDocumentFragment();
  for (let day = 1; day <= totalDays; day++) {
    let option = document.createElement("option");
    option.setAttribute("value", day);
    option.textContent = day;
    fragmentDays.appendChild(option);
  }
  selectDays.textContent = "";
  selectDays.appendChild(fragmentDays);

  lastDaySelected = parseInt(selectDays.lastElementChild.value) - 1; // Saving the last day selected in the select days

  if (
    monthValue === "2" ||
    (yearValue === CURRENT_YEAR && currentDaySelected === 29) ||
    currentDaySelected === 30
  )
    currentDaySelected = [28, 29, 30].includes(currentDaySelected)
      ? lastDaySelected
      : currentDaySelected; // This check is useful for show the last day selected depending on the month and year selected

  let days = [...selectDays.children];
  days[currentDaySelected ?? CURRENT_DATE - 1].setAttribute("selected", true); // Show the last selected day without having modified the month or the year
};

/* FUNCTION TO SET THE CURRENT MONTH BY DEFAULT */
let setCurrentMonth = () => {
  let months = [...selectMonths.children];
  months
    .find((month) => month.value === `${CURRENT_MONTH}`)
    .setAttribute("selected", true);
};

/* FUNCTION TO LOAD THE YEARS */
let loadYears = () => {
  let fragmentYears = document.createDocumentFragment();
  for (let year = 1900; year <= CURRENT_YEAR; year++) {
    let option = document.createElement("option");
    option.setAttribute("value", year);
    option.textContent = year;
    fragmentYears.appendChild(option);
  }
  selectYears.appendChild(fragmentYears);

  let years = [...selectYears.children];
  years
    .find((year) => year.value === `${CURRENT_YEAR}`)
    .setAttribute("selected", true); // Show the last selected day without having modified the month or the year
};

loadDays();
setCurrentMonth();
loadYears();

form.addEventListener("submit", (e) => e.preventDefault());
selectYears.addEventListener("change", (e) =>
  loadDays(e.target.value, selectMonths.value)
);
selectMonths.addEventListener("change", (e) =>
  loadDays(selectYears.value, e.target.value)
);

submitButton.addEventListener("click", () => {
  containerResult.classList.remove("container-result--hidden");
  let result = calculateAge(
    parseInt(selectDays.value),
    parseInt(selectMonths.value),
    parseInt(selectYears.value)
  );
  messageParagraph.textContent = result;
});

deleteButton.addEventListener("click", () =>
  containerResult.classList.add("container-result--hidden")
);
