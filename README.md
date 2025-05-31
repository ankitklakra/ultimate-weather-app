# Ultimate Weather App 🌤️

A modern, responsive weather application built with React and Material-UI that provides real-time weather information, forecasts, and air quality data.

## Features 🌟

- 🌍 **Current Location Weather**: Automatically detects and displays weather for your current location
- 🔍 **City Search**: Search for weather information of any city worldwide
- 📊 **Detailed Weather Information**:
  - Current temperature and conditions
  - Humidity and wind speed
  - Feels like temperature
  - Cloud coverage
- 📅 **5-Day Forecast**: View weather predictions for the next 5 days
- 🌫️ **Air Quality Index**: Check air quality and pollution levels
- 🎨 **Dynamic Backgrounds**: Beautiful background images that change based on weather conditions
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🌈 **Modern UI**: Clean and intuitive interface with Material Design

## Technologies Used 🛠️

- React.js
- Material-UI
- Axios
- OpenWeatherMap API
- Unsplash API
- Geolocation API

## Prerequisites 📋

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key
- Unsplash API key

## Installation 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/ankitklakra/ultimate-weather-app.git
   cd ultimate-weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```
   REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key
   REACT_APP_UNSPLASH_API_KEY=your_unsplash_api_key
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Getting API Keys 🔑

### OpenWeatherMap API
1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Navigate to your API keys section
4. Copy your API key

### Unsplash API
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Sign up or log in
3. Create a new application
4. Copy your Access Key

## Usage 📱

1. **Current Location Weather**:
   - Allow location access when prompted
   - Weather information will automatically load for your location

2. **Search for a City**:
   - Enter a city name in the search box
   - Click the search button or press Enter
   - View detailed weather information

3. **View Different Information**:
   - Use the tabs to switch between:
     - Current Weather
     - 5-Day Forecast
     - Air Quality

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Background images from [Unsplash](https://unsplash.com/)
- Icons from [Material Icons](https://material.io/resources/icons/)

## Contact 📧

Ankit Lakra - [GitHub](https://github.com/ankitklakra)

Project Link: [https://github.com/ankitklakra/ultimate-weather-app](https://github.com/ankitklakra/ultimate-weather-app)

## Deployment 🚀

### Deploying to Netlify

1. **Build the project**:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Deploy using Netlify CLI**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Initialize and deploy
   netlify init
   ```

3. **Or deploy directly from Netlify UI**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     - Build command: `npm run build` or `yarn build`
     - Publish directory: `build`
   - Add environment variables in Netlify UI:
     - `REACT_APP_OPENWEATHER_API_KEY`
     - `REACT_APP_UNSPLASH_API_KEY`

4. **Configure Environment Variables**:
   - Go to Site settings > Build & deploy > Environment
   - Add your environment variables:
     ```
     REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key
     REACT_APP_UNSPLASH_API_KEY=your_unsplash_api_key
     ```

5. **Trigger a new deployment**:
   - Go to Deploys
   - Click "Trigger deploy" > "Deploy site"

Your app will be live at `https://your-site-name.netlify.app`