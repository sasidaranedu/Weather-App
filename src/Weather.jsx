import clear from "./assets/icon/clear.png";
import clouds from "./assets/icon/clouds.png";
import drizzle from "./assets/icon/drizzle.png";
import humidityIcon from "./assets/icon/humidity.png";
import mist from "./assets/icon/mist.png";
import rain from "./assets/icon/rain.png";
import snow from "./assets/icon/snow.png";
import storm from "./assets/icon/storm.png";
import windspeedIcon from "./assets/icon/windspeed.png";

import clearimg from "./assets/image/clear.jpg";
import cloudsimg from "./assets/image/clouds.jpg";
import mistimg from "./assets/image/mist.png";
import rainimg from "./assets/image/rain.jpg";
import snowimg from "./assets/image/snow.jpg";
import stormimg from "./assets/image/storm.jpg";

import { useState } from "react";

const Weather = () => {
  const [background, setBackground] = useState(snowimg);
  const [icon, setIcon] = useState(clear);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [temp, setTemp] = useState(0);
  const [weatherType, setWeatherType] = useState("");
  const [lon, setLon] = useState(0);
  const [lat, setLat] = useState(0);
  const [windspeed, setWindspeed] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = `306820b7c8d1d991b2ad531a450c1346`;

  const weatherIconMap = {
    "01d": clear,
    "01n": clear,
    "02d": clouds,
    "02n": clouds,
    "03d": clouds,
    "03n": clouds,
    "04d": clouds,
    "04n": clouds,
    "09d": drizzle,
    "09n": drizzle,
    "10d": rain,
    "10n": rain,
    "11d": storm,
    "11n": storm,
    "13d": snow,
    "13n": snow,
    "50d": mist,
    "50n": mist,
  };

  const weatherImage = {
    "01d": clearimg,
    "01n": clearimg,
    "02d": cloudsimg,
    "02n": cloudsimg,
    "03d": cloudsimg,
    "03n": cloudsimg,
    "04d": cloudsimg,
    "04n": cloudsimg,
    "09d": rainimg,
    "09n": rainimg,
    "10d": rainimg,
    "10n": rainimg,
    "11d": stormimg,
    "11n": stormimg,
    "13d": snowimg,
    "13n": snowimg,
    "50d": mistimg,
    "50n": mistimg,
  };

  function handleCity(e) {
    setText(e.target.value);
  }

  const search = async () => {
    setLoading(true);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === "404") {
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setCityName(data.name);
      setTemp(Math.floor(data.main.temp));
      setWeatherType(data.weather[0].main);
      setLon(data.coord.lon);
      setLat(data.coord.lat);
      setHumidity(data.main.humidity);
      setWindspeed((data.wind.speed * 3.6).toFixed(2));
      setCountry(data.sys.country);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clear);
      setBackground(weatherImage[weatherIconCode] || clearimg);

      setCityNotFound(false);
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  function handleClick() {
    search();
  }

  function handleKeydown(e) {
    if (e.key === "Enter") {
      search();
    }
  }
  return (
    <>
      <div
        className="outer-container"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="container">
          <div className="input-section">
            <input
              type="text"
              name="search"
              placeholder="Enter City Name"
              value={text}
              onChange={handleCity}
              onKeyDown={handleKeydown}
            />
            <button onClick={handleClick}>
              <i className="icon fa-solid fa-magnifying-glass fa-lg"></i>
            </button>
          </div>
          {loading ? (
            <p className="loading">Please Wait...</p>
          ) : (
            <Getweather
              icon={icon}
              iscityfound={cityNotFound}
              city={cityName}
              country={country}
              temp={temp}
              lon={lon}
              lat={lat}
              windspeed={windspeed}
              humidity={humidity}
              weathertype={weatherType}
            />
          )}
        </div>
      </div>
    </>
  );
};

function Getweather(props) {
  const {
    icon,
    iscityfound,
    city,
    country,
    temp,
    lon,
    lat,
    windspeed,
    humidity,
    weathertype,
  } = props;

  return (
    <>
      <div className="weather-section">
        <div className="city">
          <i className="loc-icon fa-solid fa-location-dot"></i>
          {iscityfound ? (
            <p>City Not Found</p>
          ) : (
            <p>
              {city}, {country}
            </p>
          )}
        </div>
        <div className="temp-info">
          <img src={icon} alt="cloud-icon" />

          <div className="temperature">
            <div className="celsius-detail">
              {temp}
              <span>°</span>C
            </div>
            <div className="weather-detail">{weathertype}</div>
          </div>
        </div>
        <div className="coord ">
          <div className="log">
            <h3>{lon}</h3>
            <span className="coord-name">Longitude</span>
          </div>
          <div className="lat">
            <h3>{lat}</h3>
            <span className="coord-name">Latitude</span>
          </div>
        </div>
        <div className="weather-elements">
          <div className="windspeed element">
            <div>
              <img src={windspeedIcon} alt="windspeed" />
              <span>{windspeed}Km/h</span>
            </div>
            <p>Wind Speed</p>
          </div>
          <div className="humidity element">
            <div>
              <img src={humidityIcon} alt="humidity" />
              <span>{humidity}%</span>
            </div>
            <p>Humidity</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Weather;
