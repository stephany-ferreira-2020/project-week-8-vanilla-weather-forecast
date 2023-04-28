function formatDate(timestamp) {
  let date = new Date(timestamp)
  let hours = date.getHours()
  if (hours < 10) {
    hours = `0${hours}`
  }
  let minutes = date.getMinutes()
  if (minutes < 10) {
    minutes = `0${minutes}`
  }
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  let day = days[date.getDay()]
  return `Last updated: ${day}, ${hours}:${minutes} (local time)`
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector('.temperature')
  let cityElement = document.querySelector('.cityName')
  let weatherDescriptionElement = document.querySelector('.weatherDescription')
  let humidityElement = document.querySelector('.humidity')
  let windSpeedElement = document.querySelector('.windSpeed')
  let dateElement = document.querySelector('.dateAndTime')
  let weatherIconElement = document.querySelector('.weatherIcon')

  celsiusTemperature = response.data.temperature.current

  temperatureElement.innerHTML = Math.round(celsiusTemperature)
  cityElement.innerHTML = response.data.city
  weatherDescriptionElement.innerHTML = response.data.condition.description
  humidityElement.innerHTML = response.data.temperature.humidity
  windSpeedElement.innerHTML = response.data.wind.speed
  dateElement.innerHTML = formatDate(response.data.time * 1000)
  weatherIconElement.setAttribute(
    'src',
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  )
  weatherIconElement.setAttribute('alt', response.data.condition.description)
}

function search(city) {
  let apiKey = '5241f510t387b0af80ob67d9fd3b2098'
  let unit = 'metric'
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unit}`
  axios.get(apiUrl).then(displayTemperature)
}

function handleSubmit(event) {
  event.preventDefault()
  let cityInputElement = document.querySelector('#city-input')
  search(cityInputElement.value)
}

function displayFahrenheitTemperature(event) {
  event.preventDefault()
  let temperatureElement = document.querySelector('.temperature')

  celsiusLink.classList.remove('active')
  fahrenheitLink.classList.add('active')

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature)
}

function displayCelsiusTemperature(event) {
  event.preventDefault()
  let temperatureElement = document.querySelector('.temperature')

  fahrenheitLink.classList.remove('active')
  celsiusLink.classList.add('active')

  temperatureElement.innerHTML = Math.round(celsiusTemperature)
}

let celsiusTemperature = null

let form = document.querySelector('#search-form')
form.addEventListener('submit', handleSubmit)

let fahrenheitLink = document.querySelector('#fahrenheit-unit')
fahrenheitLink.addEventListener('click', displayFahrenheitTemperature)

let celsiusLink = document.querySelector('#celsius-unit')
celsiusLink.addEventListener('click', displayCelsiusTemperature)

// Seach for current location

let currentLatitude
let currentLongitude
let currentLocationButton = document.querySelector('.currentLocationButton')

currentLocationButton.addEventListener('click', (event) => {
  event.preventDefault()

  function currentCoordinates(position) {
    currentLatitude = position.coords.latitude
    currentLongitude = position.coords.longitude

    let apiKey = '5241f510t387b0af80ob67d9fd3b2098'
    let unit = 'metric'
    let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${currentLongitude}&lat=${currentLatitude}&key=${apiKey}&units=${unit}`

    function showTemperature(response) {
      let temperatureElement = document.querySelector('.temperature')
      let cityElement = document.querySelector('.cityName')
      let weatherDescriptionElement = document.querySelector(
        '.weatherDescription'
      )
      let humidityElement = document.querySelector('.humidity')
      let windSpeedElement = document.querySelector('.windSpeed')
      let dateElement = document.querySelector('.dateAndTime')
      let weatherIconElement = document.querySelector('.weatherIcon')

      celsiusTemperature = response.data.temperature.current

      temperatureElement.innerHTML = Math.round(celsiusTemperature)
      cityElement.innerHTML = response.data.city
      weatherDescriptionElement.innerHTML = response.data.condition.description
      humidityElement.innerHTML = response.data.temperature.humidity
      windSpeedElement.innerHTML = response.data.wind.speed
      dateElement.innerHTML = formatDate(response.data.time * 1000)
      weatherIconElement.setAttribute(
        'src',
        `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
      )
      weatherIconElement.setAttribute(
        'alt',
        response.data.condition.description
      )
    }

    axios.get(`${apiUrl}`).then(showTemperature)
  }

  navigator.geolocation.getCurrentPosition(currentCoordinates)
})

// using Braga as a default city
search('Braga')
