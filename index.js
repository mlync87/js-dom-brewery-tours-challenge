// use let to allow varible data entrys
let dataImport = [];
let state = [];
let url = "";
// specify the types of breweries permitted 
let allowedTypes = ["micro", "regional", "brewpub"];
let allowedCities = [];

// make a const (addEventListeners) that uses querySelector, addEventListener 
// make it responsive and link it with html via #select-state-form
const addEventListeners = () => {
  document
  .querySelector("#select-state-form")
  .addEventListener("submit", (event) => {
// use preventDefault to stop default behaviour and implement lowercase when searching
  event.preventDefault();
  const stateName = document
// use querySelector to refer to html and implement 
  .querySelector("#select-state").value
  .toLowerCase();
  renderState(stateName);
});
// use queryselector to refer to index.html
  document
  .querySelector("#filter-by-type-form")
  .addEventListener("change", (event) => {
  allowedTypes = event.target.value;
  });
};
// declare a const that will retrieve breweries in accordance with state entered
const renderState = (stateName) => {
  console.log(typeof stateName, typeof dataImport[0].state);
  document.querySelector("#breweries-list").innerHTML = "";

// use filter to import data that meets specified conditions
  state = [...dataImport.filter((item) =>
  item.state === stateName[0].toUpperCase() + stateName.slice(1).toLowerCase()
  )];
  for (brewery in state) {
  createElements(state[brewery]);
  }
};
// declare a const and use query selector to refer to html. create empty arrays for retrieved data to go into
const renderCities = input  => {
  document.querySelector("#filter-by-city-form").innerHTML = "";
  let cities = [];
// use a for loop to go through data and .push to enter data into array
  for (let i = 0; i < input.length; i++) {
  cities.push(input[i].city);
  }
// create an array containing cities retrieved in search
  let uniqueCities = [...new Set(cities)];
  for (let i = 0; i < uniqueCities.length; i++) {
  createCityElements(uniqueCities[i]);
  }
}
// declare a series of consts to contain retrieved elements(contact details etc)
const createElements = (brewery) => {
// log results of search
  console.log(brewery);
// create const referring to html and create a list with list items to hold varying details 
// retrieved in search (links, address, contact info etc)
  const list = document.querySelector("#breweries-list");
  const listElement = document.createElement("li");
// use appendchild to return updated data
  list.appendChild(listElement);
// create const for different elements returned after state search
  const listH2 = document.createElement("h2");
  const listDiv = document.createElement("div");
  const addressSection = document.createElement("section");
  const sectionPart1H3 = document.createElement("h3");
  const sectionPart1P1 = document.createElement("p");
  const sectionPart1P2 = document.createElement("p");
  const sectionPart1P2Strong = document.createElement("strong");
  sectionPart1P2.append(sectionPart1P2Strong);
// allow changes to list items so that they arent just replicating the same info
  addressSection.append(sectionPart1H3, sectionPart1P1, sectionPart1P2);
// create consts to contain elements
  const phoneSection = document.createElement("section");
  const secondSecH3 = document.createElement("h3");
  const secondSecParagraphOne = document.createElement("p");
  phoneSection.append(secondSecH3, secondSecParagraphOne);
  const sectionLink = document.createElement("section");
  const section3Anchor = document.createElement("a");
  sectionLink.append(section3Anchor);
  listElement.append(listH2, listDiv, addressSection, phoneSection, sectionLink);
// specify details that have to go into each list item in each different brewery
  listH2.innerHTML = brewery.name;
  listDiv.className = "type";
  listDiv.innerHTML = brewery.brewery_type;
// assign addressSection to contain address details, and set the text to appear above listed address
  addressSection.className = "address";
  sectionPart1H3.innerHTML = "Address:";
  sectionPart1P1.innerHTML = brewery.street;
  sectionPart1P2Strong.innerHTML = `${brewery.city}, ${brewery.postal_code}, ${brewery.state}`;
// assign phoneSection to contain phone number details, and set the text to appear above contact number
  phoneSection.className = "phone";
  secondSecH3.innerHTML = "Phone:";
  secondSecParagraphOne.innerHTML = brewery.phone;
  sectionLink.className = "link";
// set brewery website url to button
  section3Anchor.setAttribute("href", brewery.website_url);
  section3Anchor.setAttribute("target", "_blank");
// set text for button containing link to website
  section3Anchor.innerHTML = "Visit Website";
};

const init = () => {
  console.log("starting");
  addEventListeners();
};

init();

// extension 1
// Here i will attampt to implement functions for the first extension.
// Declare const to target the data input and filter them through required specs.
// render the data according to the new state declared.

const searchFunction = (event) => {
  let input = event.target.value.toLowerCase();
  const newState = state.filter((item) =>
  item.name.toLowerCase().includes(input)
  );
  renderState(newState);
};

// extension 2
// here i will attempt to establish a filter by city section to the left of the screen
// if an item in the dropdown menu is checked it will re-render the results list accordingly

// declare a const for data input that will contain checkboxes and enable user to filter through 
// declared variables
const createCityElements = (input) => {
  const cityListInput = document.createElement("input");
  const cityListLabel = document.createElement("label");
  cityListInput.setAttribute("type", "checkbox");
  cityListInput.setAttribute("id", "filter-by-city-checkbox");
  cityListInput.setAttribute("name", "city-checkbox");
  cityListInput.setAttribute("value", input);
  cityListInput.addEventListener("change", (event) => {
    event.preventDefault();

// if box is checked, changed results list accordingly
    if (event.target.checked) {
      let checkedCity = event.target.value.toLowerCase();
      allowedCities.push(checkedCity);
    }
// if box is unchecked remove it from the results list
    if (!event.target.checked) {
      let unCheckedCity = event.target.value.toLowerCase();
      allowedCities = allowedCities.filter((city) => city !== unCheckedCity);
      if (!document.querySelector("#filter-by-city-checkbox").checked) {
        fetchAndRender(url);
      }
    }
    const newState = state.filter((item) =>
      allowedCities.includes(item.city.toLowerCase())
    );
// display selected items in results list according to checklist
    renderState(newState);
  });

  cityListLabel.setAttribute("for", "filter-by-city-checkbox");
  cityListLabel.innerHTML = input;

  document
    .querySelector("#filter-by-city-form")
    .append(cityListInput, cityListLabel);
};
// declare a clearAll function for the clear all button below left menu.

const clearAll = () => {
  document.querySelector("#filter-by-city-checkbox").checked = false;
  allowedCities = [];
  fetchAndRender(url);
}

// create a const to load filtered data to current display
// use fetch to retrieve data from brewery database
const loadDataToState = () => {
  console.log("Loading data");
// ive decided to limit the amount of results retrieved to 30 so that the inspect 
// element of the page is easier to examine
  for (let i = 1; i < 30; i++) {
    fetch(`https://api.openbrewerydb.org/breweries?page=${i}`)
    .then(function (response) {
      return response.json();
    })
    // push the data and include the type of brewery, contact details
    .then((breweries) => {
      const importedData = [...breweries];
      dataImport.push(...importedData.filter((item) =>
      allowedTypes.includes(item.brewery_type)
    ))
    })

}}

loadDataToState()

