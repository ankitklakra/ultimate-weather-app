import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  alpha,
  useMediaQuery,
  Link,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Air,
  WaterDrop,
  Speed,
  WbSunny,
  Cloud,
  Opacity,
  WbCloudy,
  AcUnit,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const UNSPLASH_API_KEY = process.env.REACT_APP_UNSPLASH_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

function WeatherApp() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airPollution, setAirPollution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getCoordinates = async (cityName) => {
    try {
      const response = await axios.get(`${GEO_URL}/direct`, {
        params: {
          q: cityName,
          limit: 1,
          appid: API_KEY,
        },
      });
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat, lon };
      }
      throw new Error('City not found');
    } catch (err) {
      throw err;
    }
  };

  const fetchWeatherData = async (coords) => {
    try {
      const [weatherRes, forecastRes, pollutionRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather`, {
          params: {
            lat: coords.lat,
            lon: coords.lon,
            appid: API_KEY,
            units: 'metric',
          },
        }),
        axios.get(`${BASE_URL}/forecast`, {
          params: {
            lat: coords.lat,
            lon: coords.lon,
            appid: API_KEY,
            units: 'metric',
          },
        }),
        axios.get(`${BASE_URL}/air_pollution`, {
          params: {
            lat: coords.lat,
            lon: coords.lon,
            appid: API_KEY,
          },
        }),
      ]);

      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
      setAirPollution(pollutionRes.data);
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);
    setForecast(null);
    setAirPollution(null);

    try {
      const coords = await getCoordinates(city);
      await fetchWeatherData(coords);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to fetch weather data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <WbSunny sx={{ fontSize: isMobile ? 40 : 60 }} />;
      case 'clouds':
        return <WbCloudy sx={{ fontSize: isMobile ? 40 : 60 }} />;
      case 'rain':
        return <WaterDrop sx={{ fontSize: isMobile ? 40 : 60 }} />;
      case 'snow':
        return <AcUnit sx={{ fontSize: isMobile ? 40 : 60 }} />;
      default:
        return <WbSunny sx={{ fontSize: isMobile ? 40 : 60 }} />;
    }
  };

  const getAirQualityIndex = (aqi) => {
    const aqiMap = {
      1: 'Good',
      2: 'Fair',
      3: 'Moderate',
      4: 'Poor',
      5: 'Very Poor',
    };
    return aqiMap[aqi] || 'Unknown';
  };

  const formatDate = (dt) => {
    return new Date(dt * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dt) => {
    return new Date(dt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWeatherImage = useCallback(async (weatherCondition) => {
    try {
      // If no Unsplash API key is available, use default backgrounds
      if (!UNSPLASH_API_KEY) {
        console.warn('Unsplash API key not found. Using default backgrounds.');
        return getDefaultBackground(weatherCondition);
      }

      const query = getWeatherQuery(weatherCondition);
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          query,
          orientation: 'landscape',
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
        },
      });
      return response.data.urls.regular;
    } catch (error) {
      console.error('Error fetching background image:', error);
      // Fallback to default background if API call fails
      return getDefaultBackground(weatherCondition);
    }
  }, []);

  const getWeatherQuery = (weatherCondition) => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        return 'sunny sky landscape';
      case 'clouds':
        return 'cloudy sky landscape';
      case 'rain':
        return 'rainy weather landscape';
      case 'snow':
        return 'snowy landscape';
      case 'thunderstorm':
        return 'thunderstorm landscape';
      case 'drizzle':
        return 'rainy city landscape';
      case 'mist':
      case 'fog':
        return 'foggy landscape';
      default:
        return 'weather landscape';
    }
  };

  const getDefaultBackground = (weatherCondition) => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        return 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
      case 'clouds':
        return 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
      case 'rain':
        return 'https://images.unsplash.com/photo-1501691223387-dd0506c89ac8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
      case 'snow':
        return 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
      default:
        return 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
    }
  };

  useEffect(() => {
    if (weather) {
      const weatherCondition = weather.weather[0].main;
      getWeatherImage(weatherCondition).then(setBackgroundImage);
    }
  }, [weather, getWeatherImage]);

  // Add function to get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  // Add function to get city name from coordinates
  const getCityFromCoordinates = async (coords) => {
    try {
      const response = await axios.get(`${GEO_URL}/reverse`, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          limit: 1,
          appid: API_KEY,
        },
      });
      if (response.data.length > 0) {
        return response.data[0].name;
      }
      throw new Error('City not found');
    } catch (err) {
      throw err;
    }
  };

  // Add useEffect to fetch weather for current location on component mount
  useEffect(() => {
    const fetchCurrentLocationWeather = async () => {
      setLoading(true);
      setError('');
      try {
        const coords = await getCurrentLocation();
        const cityName = await getCityFromCoordinates(coords);
        setCity(cityName);
        await fetchWeatherData(coords);
      } catch (err) {
        setError(
          err.message === 'Geolocation is not supported by your browser'
            ? 'Geolocation is not supported by your browser'
            : 'Failed to get your location. Please enter a city manually.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentLocationWeather();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: backgroundImage
          ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`
          : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        p: { xs: 2, sm: 3 },
        transition: 'background-image 0.5s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', flex: 1, width: '100%' }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            mb: 3,
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            gutterBottom
            align="center"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Weather Forecast
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 4,
            }}
          >
            <TextField
              fullWidth
              label="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              variant="outlined"
              size={isMobile ? 'medium' : 'large'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                minWidth: { xs: '100%', sm: 150 },
                height: { xs: 48, sm: 56 },
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                },
              }}
            >
              Search
            </Button>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress size={isMobile ? 40 : 60} />
            </Box>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {weather && (
            <>
              <Box sx={{ 
                width: '100%',
                borderBottom: 1,
                borderColor: 'divider',
                mb: 3,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                borderRadius: 2,
              }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant={isMobile ? "fullWidth" : "standard"}
                  centered={!isMobile}
                  sx={{
                    '& .MuiTab-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      fontWeight: 'bold',
                      minHeight: { xs: 48, sm: 64 },
                      padding: { xs: '6px 8px', sm: '12px 16px' },
                      textTransform: 'none',
                      color: theme.palette.text.primary,
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    },
                    '& .MuiTabs-indicator': {
                      height: 3,
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WbSunny sx={{ fontSize: { xs: 20, sm: 24 } }} />
                        <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                          Current Weather
                        </Typography>
                        <Typography sx={{ display: { xs: 'block', sm: 'none' } }}>
                          Current
                        </Typography>
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Cloud sx={{ fontSize: { xs: 20, sm: 24 } }} />
                        <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                          5-Day Forecast
                        </Typography>
                        <Typography sx={{ display: { xs: 'block', sm: 'none' } }}>
                          Forecast
                        </Typography>
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Air sx={{ fontSize: { xs: 20, sm: 24 } }} />
                        <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
                          Air Quality
                        </Typography>
                        <Typography sx={{ display: { xs: 'block', sm: 'none' } }}>
                          Air
                        </Typography>
                      </Box>
                    } 
                  />
                </Tabs>
              </Box>

              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={4} sx={{ height: '100%', borderRadius: 4 }}>
                      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <LocationOn color="primary" sx={{ mr: 1, fontSize: { xs: 24, sm: 30 } }} />
                          <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
                            {weather.name}, {weather.sys.country}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                          {getWeatherIcon(weather.weather[0].main)}
                        </Box>
                        <Typography
                          variant={isMobile ? 'h2' : 'h1'}
                          sx={{
                            my: 2,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {Math.round(weather.main.temp)}°C
                        </Typography>
                        <Typography
                          variant={isMobile ? 'h6' : 'h5'}
                          color="text.secondary"
                          sx={{ textTransform: 'capitalize', textAlign: 'center' }}
                        >
                          {weather.weather[0].description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card elevation={4} sx={{ height: '100%', borderRadius: 4 }}>
                      <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <WaterDrop color="primary" sx={{ mr: 1, fontSize: { xs: 24, sm: 30 } }} />
                              <Box>
                                <Typography variant={isMobile ? 'body1' : 'h6'}>Humidity</Typography>
                                <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
                                  {weather.main.humidity}%
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <Speed color="primary" sx={{ mr: 1, fontSize: { xs: 24, sm: 30 } }} />
                              <Box>
                                <Typography variant={isMobile ? 'body1' : 'h6'}>Wind</Typography>
                                <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
                                  {weather.wind.speed} m/s
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <WbSunny color="primary" sx={{ mr: 1, fontSize: { xs: 24, sm: 30 } }} />
                              <Box>
                                <Typography variant={isMobile ? 'body1' : 'h6'}>Feels Like</Typography>
                                <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
                                  {Math.round(weather.main.feels_like)}°C
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <Cloud color="primary" sx={{ mr: 1, fontSize: { xs: 24, sm: 30 } }} />
                              <Box>
                                <Typography variant={isMobile ? 'body1' : 'h6'}>Clouds</Typography>
                                <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
                                  {weather.clouds.all}%
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {activeTab === 1 && forecast && (
                <Grid container spacing={2}>
                  {forecast.list.slice(0, 5).map((item, index) => (
                    <Grid item xs={6} sm={4} md={2.4} key={index}>
                      <Card elevation={4} sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ p: { xs: 1.5, sm: 3 }, textAlign: 'center' }}>
                          <Typography variant={isMobile ? 'body1' : 'h6'} gutterBottom sx={{ fontWeight: 'bold' }}>
                            {formatDate(item.dt)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {formatTime(item.dt)}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                            {getWeatherIcon(item.weather[0].main)}
                          </Box>
                          <Typography
                            variant={isMobile ? 'h5' : 'h4'}
                            sx={{
                              fontWeight: 'bold',
                              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {Math.round(item.main.temp)}°C
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {item.weather[0].description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {activeTab === 2 && airPollution && (
                <Card elevation={4} sx={{ borderRadius: 4 }}>
                  <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                    <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom sx={{ fontWeight: 'bold' }}>
                      Air Quality Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Air color="primary" sx={{ mr: 2, fontSize: { xs: 30, sm: 40 } }} />
                          <Box>
                            <Typography variant={isMobile ? 'body1' : 'h6'}>Air Quality Index</Typography>
                            <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
                              {getAirQualityIndex(airPollution.list[0].main.aqi)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Opacity color="primary" sx={{ mr: 2, fontSize: { xs: 30, sm: 40 } }} />
                          <Box>
                            <Typography variant={isMobile ? 'body1' : 'h6'}>PM2.5</Typography>
                            <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
                              {airPollution.list[0].components.pm2_5} μg/m³
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </Paper>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          borderRadius: '16px 16px 16px 16px',
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item>
            <Typography variant="body2" color="text.secondary" align="center">
              Created with ❤️ by Ultimate Weather App
            </Typography>
          </Grid>
          <Grid item>
            <Link
              href="https://github.com/ankitklakra/ultimate-weather-app"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <GitHubIcon fontSize="small" />
              <Typography variant="body2">View on GitHub</Typography>
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Ultimate Weather App. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default WeatherApp; 