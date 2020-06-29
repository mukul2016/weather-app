let cityContainerEl = document.querySelector('#city-container')
let userFormEl = document.querySelector('#user-form')

//Function to fetch weather info given city name, and then nested fetch to get the uv index given the lon and lat.
function getWeatherInfo (city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2c8c952e8eb81c62d85119652db1d724&units=imperial`
  )
    .then(function (response) {
      return response.json()
    })
    .then(function (response) {
      if (response.coord) {
        let main = response.main
        let wind = response.wind
        var lon = response.coord.lon
        var lat = response.coord.lat
        let temp = main.temp
        let humidity = main.humidity
        let windSpeed = wind.speed

        displayTemp(lon, lat, temp, humidity, windSpeed)
      } else {
        console.log('%s not found', city)
      }
      return fetch(
        `http://api.openweathermap.org/data/2.5/uvi?appid=2c8c952e8eb81c62d85119652db1d724&lat=${lat}&lon=${lon}`
      )
    })
    .then(function (response) {
      return response.json()
    })
    .then(function (response) {
      if (response) {
        let uv = response.value
        let date = response.date_iso
        displayUV(uv, date)
      }
    })
}

//User enters the city name and clicks "search" button
let cityEl = document.querySelector('#cityId')
userFormEl.addEventListener('submit', displayCities)

//Upon click display cities add city to the list, fetches weather info and renders it via updating multiple elements.
function displayCities (event) {
  event.preventDefault()
  console.log('In the displayCities function')
  var city = cityEl.value.trim()
  if (city) {
    console.log(city)
    addCitytoList(city)
    getWeatherInfo(city)
    renderCityWeatherInfo(city)
  }
}

//Function adds city to list of cities
//TBD: Error checking for duplicate cities
function addCitytoList (city) {
  // create a container for each city
  var cityAEl = document.createElement('a')
  cityAEl.classList = 'list-item flex-row justify-space-between align-center'

  // create a span element to hold city name
  var titleEl = document.createElement('span')
  titleEl.textContent = city

  // append to container
  cityAEl.appendChild(titleEl)

  // append container to the cityContainer
  cityContainerEl.appendChild(cityAEl)
  cityAEl.addEventListener('click', renderCityWeatherInfo(city))
}

let tempEl = document.querySelector('#tempId')
let windEl = document.querySelector('#windId')
let humEl = document.querySelector('#humId')

//Function to update elements for lon, lat, temp, humidity and windspeed
function displayTemp (lon, lat, temp, humidity, windSpeed) {
  // console.log(
  //   'weather API found lon %s, lat %s, temp %s, humidity %s, wind %s',
  //   lon,
  //   lat,
  //   temp,
  //   humidity,
  //   windSpeed
  // )
  tempEl.textContent += temp
  humEl.textContent += humidity
  windEl.textContent += windSpeed
}

let cityNameEl = document.querySelector('#citynameId')
let uvEl = document.querySelector('#uvId')

//Function to update UV value in element
function displayUV (uv, date) {
  console.log('weather API found uv index %s, date %s', uv, date)
  uvEl.textContent += uv
  cityNameEl.textContent = cityNameEl.textContent + '  ' + date
}

//Function to update city element
//TBD: update various elements if user clicks on a city in the list.
function renderCityWeatherInfo (city) {
  console.log('renderCityWeatherInfo %s,', city)
  cityNameEl.textContent = city
}
