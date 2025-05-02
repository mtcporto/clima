const apiUrl = 'https://api.open-meteo.com/v1/gfs?latitude=-7.115&longitude=-34.8631&current_weather=true&hourly=temperature_2m,weather_code&timezone=America%2FSao_Paulo';
const airQualityApiUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=-7.115&longitude=-34.8631&current=uv_index,uv_index_clear_sky&hourly=uv_index,uv_index_clear_sky,european_aqi,us_aqi&timezone=America%2FSao_Paulo&domains=cams_global';

const weatherDescriptions = {
  0: 'Céu limpo',
  1: 'Principalmente ensolarado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Depositando neblina',
  51: 'Chuva leve',
  53: 'Chuva moderada',
  55: 'Chuva densa',
  56: 'Chuva leve com neve',
  57: 'Chuva densa com neve',
  61: 'Chuva congelante leve',
  63: 'Chuva congelante moderada',
  65: 'Chuva congelante densa',
  66: 'Chuva leve com granizo',
  67: 'Chuva densa com granizo',
  71: 'Queda de neve leve',
  73: 'Queda de neve moderada',
  75: 'Queda de neve densa',
  77: 'Nevadas de granizo',
  80: 'Chuva passageira leve',
  81: 'Chuva passageira moderada',
  82: 'Chuva passageira violenta',
  85: 'Chuva congelante passageira leve',
  86: 'Chuva congelante passageira densa',
  95: 'Trovoada leve ou moderada',
  96: 'Trovoada com chuva pesada',
  99: 'Trovoada com granizo pesado'
};

function updateCurrentTemperature() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const currentWeather = data.current_weather;
      const currentWeatherIcon = document.querySelector('.current-weather-icon');
      const classesToRemove = Array.from(currentWeatherIcon.classList).filter(className => className.startsWith('wi-'));
      currentWeatherIcon.classList.remove(...classesToRemove);
      currentWeatherIcon.classList.add('wi', getWeatherIcon(currentWeather.weathercode));
      currentWeatherIcon.title = weatherDescriptions[currentWeather.weathercode];

      const currentTemperature = document.querySelector('#current-temperature');
      currentTemperature.textContent = `${currentWeather.temperature} °C`;
    })
    .catch(error => console.error(error));
}

function loadWeatherData() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const hourlyData = data.hourly;

      updateCurrentTemperature();
      setInterval(updateCurrentTemperature, 3600000); // Atualizar a cada hora (3600000 ms)

      // Próximos 5 dias
      const weekDays = document.querySelector('.week');
      const weatherIcons = document.querySelector('.weather-icons');
      const temperatures = document.querySelector('.temperatures');

      const forecastData = getForecastForNextFiveDays(hourlyData); 

      const daysOfWeek = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
      const today = new Date();
      const startDayIndex = (today.getDay() + 1) % 7;

      forecastData.forEach((forecastDay, index) => {
        const dayIndex = (startDayIndex + index) % 7;

        const daySpan = document.createElement('span');
        daySpan.classList.add('day');
        daySpan.textContent = daysOfWeek[dayIndex];
        weekDays.appendChild(daySpan);

        const weatherIcon = document.createElement('i');
        weatherIcon.classList.add('wi', forecastDay.icon, 'weather-icon');
        weatherIcon.title = weatherDescriptions[forecastDay.weather];
        weatherIcons.appendChild(weatherIcon);

        const temperatureSpan = document.createElement('span');
        temperatureSpan.classList.add('temperature');
        temperatureSpan.textContent = `${forecastDay.temperature.toFixed(1)} °C`;
        temperatures.appendChild(temperatureSpan);
      });
    })
    .catch(error => console.error(error));

  // Chame a função para carregar dados de qualidade do ar e UV.
  loadAirQualityData();
}

function getWeatherIcon(code) {
  const icons = {
    0: 'wi-day-sunny',
    1: 'wi-day-sunny-overcast',
    2: 'wi-day-cloudy',
    3: 'wi-cloudy',
    45: 'wi-fog',
    48: 'wi-fog',
    51: 'wi-rain',
    53: 'wi-rain',
    55: 'wi-rain',
    56: 'wi-rain-mix',
    57: 'wi-rain-mix',
    61: 'wi-snow',
    63: 'wi-snow',
    65: 'wi-snow',
    66: 'wi-snow',
    67: 'wi-snow',
    71: 'wi-snow',
    73: 'wi-snow',
    75: 'wi-snow',
    77: 'wi-snow',
    80: 'wi-showers',
    81: 'wi-showers',
    82: 'wi-showers',
    85: 'wi-rain-mix',
    86: 'wi-rain-mix',
    95: 'wi-thunderstorm',
    96: 'wi-thunderstorm',
    99: 'wi-thunderstorm'
  };

  return icons[code] || 'wi-na';
}

function getForecastForNextFiveDays(hourlyData) {
  const dailyForecast = [];
  const days = {};

  hourlyData.time.forEach((time, index) => {
    const date = new Date(time);
    const day = date.toLocaleDateString();

    if (!days[day]) {
      days[day] = {
        date,
        temperature: hourlyData.temperature_2m[index],
        weather: hourlyData.weather_code[index]
      };
    } else {
      days[day].temperature += hourlyData.temperature_2m[index];
      days[day].weather = hourlyData.weather_code[index];
    }
  });

  Object.values(days).forEach((day, index) => {
    if (index < 5) {
      day.temperature /= 24;
      dailyForecast.push({
        date: day.date,
        temperature: day.temperature,
        weather: day.weather,
        icon: getWeatherIcon(day.weather)
      });
    }
  });

  return dailyForecast;
}

function loadAirQualityData() {
  fetch(airQualityApiUrl)
    .then(response => response.json())
    .then(data => {
      const uvIndex = data.current.uv_index;
      const usAqi = data.hourly.us_aqi.length > 0 ? data.hourly.us_aqi[0] : null;

      const airQualityInfoContainer = document.querySelector('#air-quality-info');
      if (airQualityInfoContainer) {
        let airQualityHtml = `
          <div class="air-quality-column">
            <div>Índice UV</div>
            <span class="badge ${getUvColorClass(uvIndex)}">${getUvIndexCategory(uvIndex)}</span>
          </div>
        `;

        if (usAqi !== null) {
          airQualityHtml += `
            <div class="air-quality-column">
              <div>Qualidade do Ar</div>
              <span class="badge ${getAqiColorClass(usAqi)}">${getAqiCategory(usAqi)}</span>
            </div>
          `;
        }

        airQualityInfoContainer.innerHTML = airQualityHtml;
      }
    })
    .catch(error => console.error(error));
}

function getUvColorClass(uvIndex) {
  if (uvIndex < 3) return 'bg-success';
  if (uvIndex < 6) return 'bg-warning';
  if (uvIndex < 8) return 'bg-orange';
  return 'bg-danger';
}

function getUvIndexCategory(uvIndex) {
  if (uvIndex < 3) return 'Baixo';
  if (uvIndex < 6) return 'Moderado';
  if (uvIndex < 8) return 'Alto';
  return 'Muito Alto';
}

function getAqiColorClass(aqi) {
  if (aqi <= 50) return 'bg-success';
  if (aqi <= 100) return 'bg-warning';
  if (aqi <= 150) return 'bg-orange';
  return 'bg-danger';
}

function getAqiCategory(aqi) {
  if (aqi <= 50) return 'Boa';
  if (aqi <= 100) return 'Moderada';
  if (aqi <= 150) return 'Ruim para grupos sensíveis';
  return 'Ruim';
}

// function reloadStylesheets() {
//   const links = document.querySelectorAll('link[rel="stylesheet"]');
//   links.forEach(link => {
//     const href = link.getAttribute('href').split('?')[0];
//     link.setAttribute('href', href + '?v=' + new Date().getTime());
//   });
// }

function setWeatherCardBackground() {
  const currentHour = new Date().getHours();
  const weatherCard = document.querySelector('.card-weather');

  if (weatherCard) {
    if (currentHour >= 5 && currentHour < 16) {
      weatherCard.style.setProperty('background', 'linear-gradient(to bottom left, #023a58, #48cae4)', 'important');
    } else if (currentHour >= 16 && currentHour < 18) {
      weatherCard.style.setProperty('background', 'linear-gradient(to left bottom, #177BAD, #FF6C00)', 'important');
    } else {
      weatherCard.style.setProperty('background', 'linear-gradient(to bottom left, #000000, #024163)', 'important');
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadWeatherData();
  setWeatherCardBackground();
  // reloadStylesheets(); 
});



