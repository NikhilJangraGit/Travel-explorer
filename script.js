const searchBtn = document.getElementById("search-btn");
const countryInput = document.getElementById("country-input");
const countryInfo = document.getElementById("country-info");
const weatherInfo = document.getElementById("weather-info");
const mapContainer = document.getElementById("map-container");
const toggleTheme = document.getElementById("checkbox");

searchBtn.addEventListener("click", async () => {
  const country = countryInput.value.trim();
  if (!country) return alert("Enter a country name!");

  try {
    // Fetch country data
    const countryRes = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    const countryData = await countryRes.json();
    const data = countryData[0];
    document.getElementsByClassName("info-card")[0].style.display="block";
    document.getElementsByClassName("weather")[0].style.display="block";
    document.getElementsByClassName("map")[0].style.display="block";
    countryInfo.innerHTML = `
      <h2>${data.name.common} (${data.cca2})</h2>
      <img src="${data.flags.svg}" alt="Flag" width="100">
      <p><strong>Capital:</strong> ${data.capital}</p>
      <p><strong>Population:</strong> ${data.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${data.region}</p>
      <p><strong>Languages:</strong> ${Object.values(data.languages).join(", ")}</p>
      <p><strong>Currency:</strong> ${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</p>
    `;

    // Map
    const latlng = data.latlng;
    mapContainer.innerHTML = `
      <iframe
        width="100%"
        height="300"
        style="border:0"
        loading="lazy"
        allowfullscreen
        src="https://www.google.com/maps?q=${latlng[0]},${latlng[1]}&hl=es;z=6&output=embed">
      </iframe>
    `;

    // Fetch weather
    const weatherRes = await fetch(`
http://api.weatherapi.com/v1/current.json?key=32b9575d31594c13bf345709252108&q=${data.name.common}&aqi=no`);
    const weather = await weatherRes.json();

    weatherInfo.innerHTML = `
      <h3>Weather in ${data.capital[0]}</h3>
      <p><strong>Temperature:</strong> ${weather.current.temp_c}°C</p>
      <p><strong>Condition:</strong> ${weather.current.condition.text}</p>
    `;
  } catch (error) {
    alert("Country not found!");
  }
});

// Dark/Light Mode Toggle
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}
