var searchEl = document.querySelector(".btn");

searchEl.addEventListener("click", btn);

function btn(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector("#myInput").value;

  console.log(searchInputVal);
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
  searchApi(searchInputVal);
  brewList(searchInputVal);
}

// Search API with value to find Lat/Lon then finding correspinging weather
function searchApi(searchInputVal) {
  var geoURL = "https://api.openweathermap.org/geo/1.0/direct";

  geoURL =
    geoURL +
    "?q=" +
    searchInputVal +
    "&limit=1&appid=e54dee0cc53d0b5d7fada68322d11e01";

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
          printResults(weatherData);
        });
    })
    .catch(function (error) {
      console.error(error);
    });
}

function printResults(weatherData) {
  var currentContainer = document.querySelector(".currentContainer");
  currentContainer.innerHTML = "";

  // Variables designated from the API response.
  var temp = weatherData.list[0].main.temp;
  var humidity = weatherData.list[0].main.humidity;
  var wind = weatherData.list[0].wind.speed;
  var name = weatherData.city.name;
  var iconCode = weatherData.list[0].weather[0].icon;
  var iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Creating an element to display information.
  var card = document.createElement("div");
  card.classList.add("card", "p-2");
  // Organizing the card content with a variable.
  var cardContent = `
                <h2 class="card-title">${name}</h2>
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
  var brewContainer = document.querySelector(".brewContainer");
  brewContainer.innerHTML = "";
  // Pulling variables for 10 brewries with a for-loop.
  for (var i = 1; i < Math.min(100, breweryInfo.length); i++) {
    var card = document.createElement("div");
    card.classList.add("card", "p-2", "flex-auto");

    // Variables displaying in the days from the API.
    var name = breweryInfo[i].name;
    var address = breweryInfo[i].address_1;
    var phoneNum = breweryInfo[i].phone;
    var website = breweryInfo[i].website_url;


    // Organizing card content.
    var cardContent = `
                <h5 class="card-title">${name}</h5>
                <p class="card-text">Address: ${address} </p>
                <p class="card-text">Phone Number: ${phoneNum}</p>
                <p class="card-text"> ${website}</p>
            `;
    // Appeniding information to list ten local brewries.
    card.innerHTML = cardContent;
    brewContainer.appendChild(card);
  }
}
