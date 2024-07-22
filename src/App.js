// App.js
import './App.css';
import { Search, MapPin, Wind } from 'react-feather';
import getWeather from './api/api';
import { useState } from 'react';
import dateFormat from 'dateformat';

function App() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);

    const getWeatherbyCity = async () => {
        const weatherData = await getWeather(city);
        setWeather(weatherData);
        setCity("");
    }

    const renderDate = () => {
        let now = new Date();
        return dateFormat(now, "dddd, mmmm dS, h:MM TT");
    }

    return (
        <div className="app">
            <h1>Ultimate Weather App</h1>
            <div className="input-wrapper">
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                    placeholder='Enter City Name' />
                <button onClick={() => getWeatherbyCity()}>
                    <Search></Search>
                </button>
            </div>

            {weather && weather.location ?
                <div className="content">
                    <div className="location d-flex">
                        <MapPin></MapPin>
                        <h2>{weather.location.name} <span>({weather.location.country})</span></h2>
                    </div>
                    <p className="datetext">{renderDate()}</p>

                    <div className="weatherdesc d-flex flex-c">
                        <img src={weather.icon} alt={weather.condition} />
                        <h3>{weather.condition}</h3>
                    </div>

                    <div className="tempstats d-flex flex-c">
                        <h1>{weather.temp_c} <span>&deg;C</span></h1>
                        <h3>Feels Like {weather.feelslike_c} <span>&deg;C</span></h3>
                    </div>

                    <div className="windstats d-flex">
                        <Wind></Wind>
                        <h3>Wind is {weather.wind_kph} kph in {weather.wind_degree}&deg;</h3>
                    </div>
                </div>
                :
                <div className="content">
                    <h4>No Data found!</h4>
                </div>
            }
             <h4>Powered by - WeatherAPI | Weatherbit | AccuWeather </h4>
             <h4>Created by <a href="https://github.com/ankitklakra">ankitklakra</a></h4>
        </div>
        
    );
}

export default App;
