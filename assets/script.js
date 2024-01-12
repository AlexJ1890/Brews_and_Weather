var searchEl = document.querySelector(".btn");
var select = document.getElementById("state");
searchEl.addEventListener("click", btn);
var usStates = [
  { name: 'ALABAMA', abbreviation: 'AL'},
  { name: 'ALASKA', abbreviation: 'AK'},
  { name: 'ARIZONA', abbreviation: 'AZ'},
  { name: 'ARKANSAS', abbreviation: 'AR'},
  { name: 'CALIFORNIA', abbreviation: 'CA'},
  { name: 'COLORADO', abbreviation: 'CO'},
  { name: 'CONNECTICUT', abbreviation: 'CT'},
  { name: 'DELAWARE', abbreviation: 'DE'},
  { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
  { name: 'FLORIDA', abbreviation: 'FL'},
  { name: 'GEORGIA', abbreviation: 'GA'},
  { name: 'HAWAII', abbreviation: 'HI'},
  { name: 'IDAHO', abbreviation: 'ID'},
  { name: 'ILLINOIS', abbreviation: 'IL'},
  { name: 'INDIANA', abbreviation: 'IN'},
  { name: 'IOWA', abbreviation: 'IA'},
  { name: 'KANSAS', abbreviation: 'KS'},
  { name: 'KENTUCKY', abbreviation: 'KY'},
  { name: 'LOUISIANA', abbreviation: 'LA'},
  { name: 'MAINE', abbreviation: 'ME'},
  { name: 'MARYLAND', abbreviation: 'MD'},
  { name: 'MASSACHUSETTS', abbreviation: 'MA'},
  { name: 'MICHIGAN', abbreviation: 'MI'},
  { name: 'MINNESOTA', abbreviation: 'MN'},
  { name: 'MISSISSIPPI', abbreviation: 'MS'},
  { name: 'MISSOURI', abbreviation: 'MO'},
  { name: 'MONTANA', abbreviation: 'MT'},
  { name: 'NEBRASKA', abbreviation: 'NE'},
  { name: 'NEVADA', abbreviation: 'NV'},
  { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
  { name: 'NEW JERSEY', abbreviation: 'NJ'},
  { name: 'NEW MEXICO', abbreviation: 'NM'},
  { name: 'NEW YORK', abbreviation: 'NY'},
  { name: 'NORTH CAROLINA', abbreviation: 'NC'},
  { name: 'NORTH DAKOTA', abbreviation: 'ND'},
  { name: 'OHIO', abbreviation: 'OH'},
  { name: 'OKLAHOMA', abbreviation: 'OK'},
  { name: 'OREGON', abbreviation: 'OR'},
  { name: 'PENNSYLVANIA', abbreviation: 'PA'},
  { name: 'RHODE ISLAND', abbreviation: 'RI'},
  { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
  { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
  { name: 'TENNESSEE', abbreviation: 'TN'},
  { name: 'TEXAS', abbreviation: 'TX'},
  { name: 'UTAH', abbreviation: 'UT'},
  { name: 'VERMONT', abbreviation: 'VT'},
  { name: 'VIRGINIA', abbreviation: 'VA'},
  { name: 'WASHINGTON', abbreviation: 'WA'},
  { name: 'WEST VIRGINIA', abbreviation: 'WV'},
  { name: 'WISCONSIN', abbreviation: 'WI'},
  { name: 'WYOMING', abbreviation: 'WY' }
];


for(var i = 0;i<usStates.length;i++){
var option = document.createElement("option");
option.text = usStates[i].name+' ['+usStates[i].abbreviation+']';
option.value = usStates[i].abbreviation;

select.appendChild(option);
}

function btn(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector("#myInput").value;

  console.log(searchInputVal, select.value);
  // Unrecognizable input will alert user to try again.
  if (!searchInputVal) {
    alert("Unrecognizable Input");
    console.error("You need a search input value!");
    return;
  }
  
  // Search city will be stored in the Local Storage to be displayed as a search history.
  localStorage.setItem("searchInputVal", searchInputVal);

  var previousInputs = JSON.parse(localStorage.getItem("searchInputs")) || [];

  previousInputs.push(searchInputVal);

  localStorage.setItem("searchInputs", JSON.stringify(previousInputs));

  if (previousInputs.length > 10) {
    previousInputs.shift();
  }

  // Runs the function to load the Search History when the page loads so the user can click one instead of typing.
  //   loadSearchHistory();
  searchApi(searchInputVal, select.value);
  brewList(searchInputVal);
}

// Search API with value to find Lat/Lon then finding correspinging weather
function searchApi(searchInputVal, stateCode) {
  var geoURL = "https://api.openweathermap.org/geo/1.0/direct";

  geoURL =
    geoURL +
    "?q=" +
    searchInputVal + "," + stateCode +
    ",&limit=1&appid=e54dee0cc53d0b5d7fada68322d11e01";

  fetch(geoURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      console.log(locRes);

      var searchLoc = locRes[0];

      var lat = searchLoc.lat;
      var lon = searchLoc.lon;

      // API using the lat/long to find the corresponding city.
      var tempURL = "https://api.openweathermap.org/data/2.5/forecast";

      var tempURL =
        tempURL +
        "?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial&appid=e54dee0cc53d0b5d7fada68322d11e01";

      console.log(tempURL);

      fetch(tempURL)
        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }

          return response.json();
        })
        // Testing the response of the API.
        .then(function (weatherData) {
          console.log(weatherData);
          console.log("City:", weatherData.city.name);
          console.log("Temperature:", weatherData.list[0].main.temp);

          // Functions called to display the current weather.
          printResults(weatherData,locRes);
        });
    })
    .catch(function (error) {
      console.error(error);
    });
}

function printResults(weatherData, locRes) {
  var currentContainer = document.querySelector(".currentContainer");
  currentContainer.innerHTML = "";

  // Variables designated from the API response.
  var temp = weatherData.list[0].main.temp;
  var humidity = weatherData.list[0].main.humidity;
  var wind = weatherData.list[0].wind.speed;
  var name = weatherData.city.name;
  var iconCode = weatherData.list[0].weather[0].icon;
  var stateweather = locRes[0].state;
  console.log(locRes[0].state)
  var iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Creating an element to display information.
  var card = document.createElement("div");
  card.classList.add(
    "card",
    "p-4",
    "rounded",
    "overflow-hidden",
    "shadow-lg",
    "w-1/2"
    );
  // Organizing the card content with a variable.
  var cardContent = `
                <h2 class="card-title text-left">${name}, ${stateweather}</h2>

                <img class="weatherIcon" src="${iconUrl}" alt="Weather Icon" />
                <p class="card-text">Temp: ${temp} F</p>
                <p class="card-text">Humidity: ${humidity}%</p>
                <p class="card-text">Wind: ${wind}</p>
            `;
  // Appending information to the Card.
  card.innerHTML = cardContent;
  currentContainer.appendChild(card);
}

function brewList(searchInputVal) {
  var brewURL = "https://api.openbrewerydb.org/v1/breweries";

  brewURL = brewURL + "?by_city=" + searchInputVal + "&per_page=100";

  fetch(brewURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (breweryInfo) {
      console.log(breweryInfo);

      brewResults(breweryInfo);
    });
}

function brewResults(breweryInfo) {
  // write conditional to filter out all breweries that are not in the users desired state
  console.log(breweryInfo[0].state)

  var brewContainer = document.querySelector(".brewContainer");
  brewContainer.innerHTML = "";
  // Pulling variables for 10 brewries with a for-loop.
  for (var i = 1; i < Math.min(100, breweryInfo.length); i++) {
    var card = document.createElement("div");
    card.classList.add(
      "p-6",
      "w-2/6",
      "rounded",
      "overflow-hidden",
      "shadow-lg"
    );
    // Variables displaying in the days from the API.
    var name = breweryInfo[i].name;
    var address = breweryInfo[i].address_1;
    var citytag = breweryInfo[i].city;
    var state = breweryInfo[i].state;
    var phoneNum = breweryInfo[i].phone;
    var website = breweryInfo[i].website_url;

    // Organizing card content.
    var cardContent = `
                <h5 class="card-title font-bold text-xl mb-2"><a href="${website}"> ${name}</a></h5>
                <p class="card-text">Address: ${address} </p>
                <p class="card-text">City: ${citytag}</p>
                <p class="card-text">State: ${state}</p>
                <p class="card-text">Phone Number: ${phoneNum}</p>
            `;
    // Appeniding information to list ten local brewries.
    card.innerHTML = cardContent;
    brewContainer.appendChild(card);
  }
}
