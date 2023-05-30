import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";

export default function App() {
  let [input, Setinput] = useState("");
  let [city, setCity] = useState("");
  let [temperature, setTem] = useState(null);
  let [description, SetD] = useState("");
  let [humidity, SetH] = useState(null);
  let [Wind, setW] = useState(null);
  let [icon, Seticon] = useState(null);
  let [country, Setcountry] = useState("");
  let [date, Setdate] = useState("");
  let [unit, setUnit] = useState("");
  let [forecastData, setForecastData] = useState([]);

  function formatDate(timestamp) {
    let current = new Date(timestamp);
    let hours = current.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = current.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[current.getDay()];
    return `${day} ${hours}:${minutes}`;
  }

  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
  }

  function DisplayForecast(response) {
    let forecast = response.data.daily;

    let forecastElements = forecast.map(function (forecastday, index) {
      if (index < 6) {
        return (
          <div className="col-4 col-md-2" key={index}>
            <div className="ctn">
              <div className="next6days">{formatDay(forecastday.time)}</div>
              <img
                src={forecastday.condition.icon_url}
                alt={forecastday.condition.icon}
                className="forecastimg"
              />
              <div className="forecastTemp">
                <span className="max">
                  {Math.round(forecastday.temperature.maximum)}
                </span>
                <span className="min">
                  {Math.round(forecastday.temperature.minimum)}
                </span>
              </div>
            </div>
          </div>
        );
      }
      return null;
    });

    setForecastData(forecastElements);
  }

  function DisplayAll(response) {
    setCity(response.data.city);
    Setcountry(response.data.country);
    setTem(`${Math.round(response.data.temperature.current)}`);
    setUnit("°C");
    SetD(response.data.condition.description);
    SetH(`Humidity: ${response.data.temperature.humidity} %`);
    setW(` Wind: ${Math.round(response.data.wind.speed)} km/h`);
    Seticon(response.data.condition.icon_url);
    Setdate(`Last updated: ${formatDate(response.data.time * 1000)}`);
    getForecast(response.data.coordinates);
  }

  function getForecast(coord) {
    let Apikey = "b3584c6545a2013b0440f785b9e39t5o";
    let Url = `https://api.shecodes.io/weather/v1/forecast?lon=${coord.longitude}&lat=${coord.latitude}&key=${Apikey}&units`;
    axios.get(Url).then(DisplayForecast);
  }

  function Searchcity(event) {
    Setinput(event.target.value);
  }

  function getCity(event) {
    event.preventDefault();
    if (input.length === 0) {
      return alert("Type a city");
    }
    let Apikey = "b3584c6545a2013b0440f785b9e39t5o";
    let Url = `https://api.shecodes.io/weather/v1/current?query=${input}&key=${Apikey}&units=metric`;
    axios.get(Url).then(DisplayAll);
  }

  useEffect(() => {
    function getCurrentLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let Apikey = "b3584c6545a2013b0440f785b9e39t5o";
        let Url = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${Apikey}&units=metric`;
        axios.get(Url).then(DisplayAll);
      });
    }
    getCurrentLocation();
  });

  return (
    <div className="App">
      <div className="container p-4 mt-3">
        <form className="d-flex" onSubmit={getCity}>
          <input
            className="form-control me-2"
            type="name"
            placeholder="Type a city .."
            onChange={Searchcity}
            autoComplete="off"
          />
          <button className="btn btn-outline-light Search" type="submit">
            Search
          </button>
        </form>

        <div className="TodayWeather mt-3">
          <div className="row">
            <div className="col-7 mt-3">
              <ul>
                <li className="country">
                  <strong>{country}</strong>
                </li>
                <li>
                  <h1 id="city">{city}</h1>
                </li>
                <li id="weather-condition">{description}</li>
                <li>
                  <span id="date">{date}</span>
                </li>
              </ul>
            </div>
            <div className="col-5">
              <img
                src={icon}
                className="icon image-fluid"
                alt={description}
                id="imgT"
              />
              <div className="d-flex justify-content-center">
                <h1 className="temp">{temperature}</h1>
                <strong className="unitT">{unit}</strong>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <ul>
              <li id="wh">
                <span className="wind">{Wind}</span>
              </li>
              <li id="wh">
                <span className="humidity">{humidity}</span>
              </li>
            </ul>
          </div>

          <div className="weather-forecast mt-5">
            <div className="row">{forecastData}</div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
