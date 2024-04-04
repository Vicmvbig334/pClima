// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherIconUrl, setWeatherIconUrl] = useState(''); 
  const [searched, setSearched] = useState(false); // para saber se clicou no botão para pesquisar
  const [error, setError] = useState(null); // Procura erros, para caso encontre, possa mostrar a mensagem de erro
  const [isCelsius, setIsCelsius] = useState(true); // nesse caso, para saber a unidade de temperatura
 const convertToFahrenheit = (temperature) => {
  return (temperature * 9/5) + 32;
};


// busca os dados do clima a partir da OpenWeatherMap
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=pt_br&units=metric&appid=1deb1b9580c45b94d23e9d81be4eb0c5`
      );
      setWeatherData(response.data);
      fetchWeatherIcon(response.data.weather[0].icon); 
      setError(null); // limpa o ero, em caso de sucesso
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
      setError(error); 
    }
  };

  const fetchWeatherIcon = async (iconCode) => {
    try {
      const response = await axios.get(
        `https://openweathermap.org/img/wn/${iconCode}.png`
      );
      setWeatherIconUrl(response.config.url);
    } catch (error) {
      console.error('Error fetching weather icon:', error);
      setWeatherIconUrl('');
    }
  };
  

  useEffect(() => {
    if (city && searched) { // busca os dados apenas se o usuário clicou para pesquisar
      fetchData();
    }
  }, [city, searched]); // Busca os dados quando muda a cidade pesquisada

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearched(true); // Marca que cliquei para pesquisar
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Cidade"
          value={city}
          onChange={handleInputChange}
        />
      <button type="submit">Pesquisar Clima</button> 
      </form>
      {error && searched && (
        <div className='error-message'>
          Desculpe, cidade não encontrada.
        </div>
      )}
      {weatherData && !error && searched && (
        <div className='results'>
          <img src={weatherIconUrl} alt="Weather Icon" />
          <h2>{weatherData.name},</h2>
          <h3>{weatherData.sys.country}</h3>
          <p>Temperatura: {weatherData.main.temp}°C ({convertToFahrenheit(weatherData.main.temp)}°F)</p>
          <p>Descrição: {weatherData.weather[0].description}</p>
          <p>Sensação Térmica : {weatherData.main.feels_like}°C ({convertToFahrenheit(weatherData.main.feels_like)}°F)</p>
          <p>Umidade : {weatherData.main.humidity}%</p>
          <p>Vento : {weatherData.wind.speed}m/s</p>
  
        </div>
      )}
      {!error && !weatherData && searched && (
        <p className='bottomText'></p>
      )}
    </div>
  );
};

export default Weather;