# Weather App

## Overview

The Weather App is a React-based application that provides weather information using multiple weather APIs. It fetches data from WeatherAPI, Weatherbit, and AccuWeather, compares the results, and displays the most probable weather condition.

## Features

- Fetches weather data from multiple sources.
- Compares weather conditions from WeatherAPI, Weatherbit, and AccuWeather.
- Displays the most probable weather condition.
- Shows temperature, feels-like temperature, wind speed, and weather condition.

## Technologies

- React
- JavaScript
- CSS
- Fetch API

## APIs Used

1. **WeatherAPI**
   - API Key: `94ce259252744510924165916242207`
   - Endpoint: `http://api.weatherapi.com/v1/current.json`

2. **Weatherbit**
   - API Key: `aed9e39dd7e4418b881e076037b8b983`
   - Endpoint: `https://api.weatherbit.io/v2.0/current`

3. **AccuWeather**
   - API Key: `LohwJRzG4iKMZsThAe2N6LNMLW7z2cDe`
   - Endpoints:
     - Location Search: `http://dataservice.accuweather.com/locations/v1/cities/search`
     - Current Conditions: `http://dataservice.accuweather.com/currentconditions/v1/{locationKey}`

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/weather-app.git
2. Navigate to the project directory:

   ```bash

   cd weather-app

3. Install the dependencies:

    ```bash
    npm install

4. Start the development server:

    ```bash

    npm start
    Open your browser and go to http://localhost:3000 to view the app.

## Usage

1. Enter the name of a city in the input field.
2. Click the search button or press Enter.
3. The app will display the most probable weather condition based on data from multiple sources.

## Code Structure

- src/api/weather.js: Contains functions to fetch weather data from different APIs and compare them.
- src/App.js: Main React component that displays weather information.
- src/App.css: Styles for the app.

## Contributing

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -am 'Add new feature').
4. Push to the branch (git push origin feature-branch).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
WeatherAPI
Weatherbit
AccuWeather