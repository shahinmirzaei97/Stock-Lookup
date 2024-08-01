// src/components/StockLookup.js
import React, { useState, useEffect } from 'react';

const StockLookup = () => {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setSymbol(event.target.value.toUpperCase());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchStockPrice();
  };

  const fetchStockPrice = async () => {
    setLoading(true);
    setError(null);
    setPrice(null);

    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('Stock symbol not found');
      }
      setPrice(data[0].price);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Stock Price Lookup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={symbol}
          onChange={handleInputChange}
          placeholder="Enter stock symbol"
        />
        <button type="submit">Get Price</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {price && <div>{symbol} Stock Price: ${price}</div>}
    </div>
  );
};

export default StockLookup;
