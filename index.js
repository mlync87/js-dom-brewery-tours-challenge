// declare consts that are needed in the following js.
// use document.querySelector to ref the const required.
const stateForm = document.querySelector("#select-state-form");
const breweriesList = document.querySelector("#breweries-list");
const filterByType = document.querySelector("#filter-by-type");
const filterByName = document.querySelector("#search-breweries");
const filterByCityForm = document.querySelector("#filter-by-city-form");
const filterByCityClearBtn = document.querySelector(".clear-all-btn");
// create a const that will differentiate between the different types of breweries.
const state = {
  types: ["micro", "regional", "brewpub"],
  breweries: [],
  filterByType: "",
  filterByName: "",
  filterByCities: [],
};
// add an eventListener for the submit button. Use preventDefault to stop the page from refreshing
// and insted display the search results when the submit button is clicked.
stateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const byState = event.target[0].value;
  // use a fetch request to retrive the info from the api containing all the info
  // on the breweries.
  fetch(
    `https://api.openbrewerydb.org/breweries?by_state=${byState}&per_page=50`
  )
    // this function runs the function passed into them, then displays
    // once the fetched resource is loaded with a parameter.
    .then((res) => res.json())
    // use .then to show the data and filter by state.
    .then((data) => {
      state.breweries = data.filter((brewery) =>
        // also display the type of brewery
        state.types.includes(brewery.brewery_type)
      );
      // use render with an empty () to display result.
      render();
    });
});
// make filterByTyoe responsive to click and allow it to change results
// list by type.
filterByType.addEventListener("change", (event) => {
  state.filterByType = event.target.value;

  render();
});

filterByName.addEventListener("input", (event) => {
  state.filterByName = event.target.value;

  render();
});

filterByCityClearBtn.addEventListener("click", (event) => {
  state.filterByCities = [];
  filterByCityForm.reset();

  render();
});

function render() {
  renderBreweries();
  renderCityFilters();
}

function renderBreweries() {
  breweriesList.innerHTML = "";
  const breweries = applyFilters();
  breweries.forEach(renderBreweryCard);
}

function renderCityFilters() {
  const breweries = applyFilters();
  // enable site to displat breweries by cities
  const cities = [];
  // If multiple breweries are in same city, display multiple results
  // for each brewery.
  breweries.forEach((brewery) => {
    // if a single city contains multiple breweries display each of them

    if (!cities.includes(brewery.city)) {
      // use .push to add them to the list of results as a separate result.
      cities.push(brewery.city);
    }
  });

  // This section is for the city filters
  filterByCityForm.innerHTML = "";
  cities.forEach((city) => {
    const input = document.createElement("input");
    // display individual characteristics for each brewery
    // type, name, and city
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", city);
    input.setAttribute("value", city);
    // if (state.filterByCities.includes(city)) {
    //   input.setAttribute("checked", true)
    // }
    input.addEventListener("change", (event) => {
      // if the box is checked then it will be passed into the filtering
      if (event.target.checked) {
        // when checked it will be added to the list
        state.filterByCities.push(city);
      } else {
        // if it is unchecked it will be removed from the list
        const foundCity = state.filterByCities.find(
          // display the filtered cities
          (filterCity) => filterCity === city
        );
        // use the splice method to change contents of the array with the new data
        state.filterByCities.splice(state.filterByCities.indexOf(foundCity), 1);
      }
      // create a new list of breweries according to filtering options
      renderBreweries();
    });
    // create a label const to contain attributes
    const label = document.createElement("label");
    // use label to change the first attribute in the element.
    label.setAttribute("for", city);
    // use .innterText to change the label accordingly
    label.innerText = city;

    filterByCityForm.append(input, label);
  });
}
// apply filtering methods when selected.
function applyFilters() {
  let filteredBreweries = state.breweries;
  // if filterbytype is not empty display according to type
  if (state.filterByType !== "") {
    filteredBreweries = filteredBreweries.filter(
      (brewery) => brewery.brewery_type === state.filterByType
    );
  }
  // if filtering section is not empty then filter by name
  if (state.filterByName !== "") {
    filteredBreweries = filteredBreweries.filter((brewery) =>
      brewery.name.includes(state.filterByName)
    );
  }
  // if list of results is greater that 0 display according to city
  if (state.filterByCities.length !== 0) {
    filteredBreweries = filteredBreweries.filter((brewery) =>
      state.filterByCities.includes(brewery.city)
    );
  }
  // return results list according to parameters met.
  return filteredBreweries;
}
// this is to display the cards in which the search results are held.
function renderBreweryCard(brewery) {
  const li = document.createElement("li");
  // display name of brewery
  const h2 = document.createElement("h2");
  h2.innerText = brewery.name;
  // display brewery type
  const div = document.createElement("div");
  div.setAttribute("class", "type");
  div.innerText = brewery.brewery_type;
  // create a section to contain the address inclusive of; street,
  // name this section 1 to contain relevant details.
  const section1 = document.createElement("section");
  section1.setAttribute("class", "address");
  const h3address = document.createElement("h3");
  h3address.innerText = "Address:";
  const p1 = document.createElement("p");
  p1.innerText = brewery.street;
  const p2 = document.createElement("p");
  p2.innerText = `${brewery.city}, ${brewery.postal_code}`;
  section1.append(h3address, p1, p2);
  // create a section to contain phone numbers retrieved from api
  const section2 = document.createElement("section");
  section2.setAttribute("class", "phone");
  const h3phone = document.createElement("h3");
  h3phone.innerText = "Phone:";
  const p3 = document.createElement("p");
  p3.innerText = brewery.phone;
  section1.append(h3phone, p3);
  // create a section =to contain the website to each brewery retrieved from api
  const section3 = document.createElement("section");
  section3.setAttribute("class", "link");
  const link = document.createElement("a");
  link.setAttribute("href", brewery.website_url);
  link.setAttribute("target", "_blank");
  // display text to appear next to the link to the brewery.
  link.innerText = "Visit Website";
  // use append to show link.
  section3.append(link);
  // use append to display different sections containing relevant info on each individual
  // brewery. Make each list item change according to the brewery.
  li.append(h2, div, section1, section2, section3);
  breweriesList.append(li);
}
