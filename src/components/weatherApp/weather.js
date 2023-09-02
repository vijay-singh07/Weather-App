import React, { useState, useEffect } from 'react';
import './weather.css';
import search_icon from '../assests/search.png';
import humidity_icon from '../assests/humidity.png';
import wind_icon from '../assests/wind.png';
import cloud_icon from '../assests/cloud.png';

const Weather = () => {
    const [city, setCity] = useState('');
    const [humidity, setHumidity] = useState('');
    const [wind, setWind] = useState('');
    const [temp, setTemp] = useState('');
    const [location, setLocation] = useState('');
    const [showMessage, setShowMessage] = useState(true);
    const [apiLimitExceeded, setApiLimitExceeded] = useState(false);
    const [apiError, setApiError] = useState('');
    const [apiCalls, setApiCalls] = useState(0);
    const maxApiCalls = 5; // Define your maximum allowed API calls here
    const api_key = "84b7088167dbbb6fe0956a33c60a8bc3";

    const search = async () => {
        if (apiCalls >= maxApiCalls) {
            setApiLimitExceeded(true);
            return;
        }

        if (city === "") {
            return;
        }

        setShowMessage(false); // Hide the message when the search button is pressed

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${api_key}`;

        try {
            let response = await fetch(url);
            let data = await response.json();

            if (data.cod === '404') {
                // Handle invalid city name
                setApiError('Please enter a valid City name and try again');
            } else {
                setHumidity(data.main.humidity);
                setWind(data.wind.speed);
                setTemp(data.main.temp);
                setLocation(data.name);
                setApiError(''); // Clear any previous error message

                // Increment the API call count
                setApiCalls(apiCalls + 1);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Reset the API call count when the component mounts
    useEffect(() => {
        setApiCalls(0);
    }, []);

    return (
        <div className='container'>
            <div className='top-bar'>
                <input
                    className='cityInput'
                    type='text'
                    placeholder='Enter a city...'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <div className='search-icon'>
                    <img src={search_icon} alt="Search Icon" onClick={search} />
                </div>
            </div>
            {apiLimitExceeded ? (
                <div className='message'>API limit has reached, wait for a moment and try again.</div>
            ) : (
                apiError ? (
                    <div className='message'>{apiError}</div>
                ) : (
                    showMessage ? (
                        <div className='message'>Enter a city to see the weather forecast</div>
                    ) : (
                        <>
                            <div className="weather-image">
                                <img src={cloud_icon} alt='cloud_icon' />
                            </div>
                            <div className='weather-temp'>{temp}°C</div>
                            <div className='weather-location'>{location}</div>
                            <div className='data-container'>
                                <div className='element'>
                                    <img src={humidity_icon} alt='humidity_icon' className='icon' />
                                    <div className='data'>
                                        <div className='humidity-percent'>{humidity}%</div>
                                        <div className='text'>Humidity</div>
                                    </div>
                                </div>
                                <div className='element'>
                                    <img src={wind_icon} alt='wind_icon' className='icon' />
                                    <div className='data'>
                                        <div className='humidity-percent'>{wind} Km/h</div>
                                        <div className='text'>Wind Speed</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                )
            )}
        </div>
    )
}

export default Weather;
