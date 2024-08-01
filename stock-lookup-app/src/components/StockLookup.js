// src/components/StockLookup.js
import React, { useState, useEffect } from 'react';

const StockLookup = () => {
  // State for storing the input value
  const [symbol, setSymbol] = useState('');
  // State for storing stock price
  const [price, setPrice] = useState(null);
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState(null);
  // State for storing portfolio stocks
  const [portfolio, setPortfolio] = useState([]);
  // State for search suggestions
  const [suggestions, setSuggestions] = useState([]);

  // Handle input changes and update suggestions
  const handleInputChange = (event) => {
    const input = event.target.value.toUpperCase();
    setSymbol(input);
    if (input.length >= 2) {
      fetchSuggestions(input);
    } else {
      setSuggestions([]);
    }
  };

  // Add selected stock to portfolio
  const handleSubmit = (event) => {
    event.preventDefault();
    addStockToPortfolio(symbol);
  };

  // Fetch stock data and add it to the portfolio
  const addStockToPortfolio = async (ticker) => {
    setLoading(true);
    setError(null);
    setPrice(null);
    setSuggestions([]);

    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('Stock symbol not found');
      }
      const newStock = {
        symbol: data[0].symbol,
        price: data[0].price,
      };
      setPortfolio([...portfolio, newStock]); // Add stock to portfolio
      setSymbol('');
    } catch (err) {
      setError(err.message); // Handle errors
    } finally {
      setLoading(false);
    }
  };

  // Remove stock from portfolio
  const removeStockFromPortfolio = (ticker) => {
    setPortfolio(portfolio.filter(stock => stock.symbol !== ticker));
  };

  // Fetch stock symbol suggestions
  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&apikey=${process.env.REACT_APP_FMP_API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSuggestions(data); // Update suggestions based on search
    } catch (err) {
      console.error('Error fetching suggestions:', err.message);
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
        <button type="submit">Add to Portfolio</button>
      </form>
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((s) => (
            <li key={s.symbol} onClick={() => addStockToPortfolio(s.symbol)}>
              {s.symbol} - {s.name}
            </li>
          ))}
        </ul>
      )}
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {portfolio.length > 0 && (
        <div>
          <h2>Portfolio</h2>
          <ul>
            {portfolio.map((stock) => (
              <li key={stock.symbol}>
                {stock.symbol}: ${stock.price}
                <button onClick={() => removeStockFromPortfolio(stock.symbol)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StockLookup;