// api/weather.js

export const getWeatherFromWeatherAPI = async (city) => {
    const apiKey = '94ce259252744510924165916242207';
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return {
            source: 'WeatherAPI',
            condition: data.current.condition.text,
            temp_c: data.current.temp_c,
            feelslike_c: data.current.feelslike_c,
            icon: data.current.condition.icon,
            wind_kph: data.current.wind_kph,
            wind_degree: data.current.wind_degree,
            location: data.location
        };
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
};

export const getWeatherFromWeatherbit = async (city) => {
    const apiKey = 'aed9e39dd7e4418b881e076037b8b983';
    const url = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return {
            source: 'Weatherbit',
            condition: data.data[0].weather.description,
            temp_c: data.data[0].temp,
            feelslike_c: data.data[0].app_temp,
            icon: `https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png`,
            wind_kph: data.data[0].wind_spd * 3.6, // convert m/s to kph
            wind_degree: data.data[0].wind_dir,
            location: {
                name: data.data[0].city_name,
                country: data.data[0].country_code
            }
        };
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
};

export const getWeatherFromAccuWeather = async (city) => {
    const apiKey = 'LohwJRzG4iKMZsThAe2N6LNMLW7z2cDe';
    const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

    try {
        const locationResponse = await fetch(locationUrl);
        if (!locationResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const locationData = await locationResponse.json();
        const locationKey = locationData[0].Key;

        const weatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const weatherData = await weatherResponse.json();
        return {
            source: 'AccuWeather',
            condition: weatherData[0].WeatherText,
            temp_c: weatherData[0].Temperature.Metric.Value,
            feelslike_c: weatherData[0].RealFeelTemperature.Metric.Value,
            icon: `https://developer.accuweather.com/sites/default/files/${String(weatherData[0].WeatherIcon).padStart(2, '0')}-s.png`,
            wind_kph: weatherData[0].Wind.Speed.Metric.Value,
            wind_degree: weatherData[0].Wind.Direction.Degrees,
            location: {
                name: locationData[0].LocalizedName,
                country: locationData[0].Country.LocalizedName
            }
        };
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
};

const getWeather = async (city) => {
    try {
        const weatherAPIData = await getWeatherFromWeatherAPI(city);
        const weatherbitData = await getWeatherFromWeatherbit(city);
        const accuWeatherData = await getWeatherFromAccuWeather(city);

        // Filter out any null data due to errors
        const weatherDataList = [weatherAPIData, weatherbitData, accuWeatherData].filter(data => data !== null);

        // Ensure we have at least one valid data source
        if (weatherDataList.length === 0) {
            throw new Error('No valid weather data available');
        }

        // Determine the most probable weather condition
        const conditionCount = {};
        weatherDataList.forEach(data => {
            conditionCount[data.condition] = (conditionCount[data.condition] || 0) + 1;
        });

        const mostProbableCondition = Object.keys(conditionCount).reduce((a, b) => conditionCount[a] > conditionCount[b] ? a : b);

        // Find the corresponding data for the most probable condition
        const mostProbableWeather = weatherDataList.find(data => data.condition === mostProbableCondition);

        return mostProbableWeather;

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
};

export default getWeather;
