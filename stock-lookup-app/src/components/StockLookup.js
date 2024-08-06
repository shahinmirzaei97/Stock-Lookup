// src/components/StockLookup.js
import React, { useState } from 'react';

const StockLookup = ({ portfolio, setPortfolio, setSelectedStocks }) => {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const input = event.target.value.toUpperCase();
    setSymbol(input);
    if (input.length >= 2) {
      fetchSuggestions(input);
    } else {
      setSuggestions([]);
    }
  };

  const fetchSuggestions = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&apikey=${process.env.REACT_APP_FMP_API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStockToPortfolio = async (ticker) => {
    setLoading(true);
    setError(null);
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
        selected: false,
      };
      if (!portfolio.find(stock => stock.symbol === newStock.symbol)) {
        setPortfolio([...portfolio, newStock]);
      }
      setSymbol('');
      setSuggestions([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectStock = (symbol) => {
    const selectedCount = portfolio.filter(stock => stock.selected).length;
    const updatedPortfolio = portfolio.map(stock =>
      stock.symbol === symbol 
        ? { ...stock, selected: !stock.selected } 
        : selectedCount < 2 || stock.selected 
          ? stock 
          : { ...stock, selected: false }
    );
    setPortfolio(updatedPortfolio);
    setSelectedStocks(updatedPortfolio.filter(stock => stock.selected));
  };

  return (
    <div>
      <h1>Stock Price Lookup</h1>
      <input
        type="text"
        value={symbol}
        onChange={handleInputChange}
        placeholder="Enter stock symbol"
      />
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((s) => (
            <li key={s.symbol}>
              {s.symbol} - {s.name}
              <button onClick={() => addStockToPortfolio(s.symbol)} style={{ marginLeft: '10px', cursor: 'pointer' }}>➕</button>
            </li>
          ))}
        </ul>
      )}
      {portfolio.length > 0 && (
        <div>
          <h2>Portfolio</h2>
          <ul>
            {portfolio.map((stock) => (
              <li key={stock.symbol}>
                <input
                  type="checkbox"
                  checked={stock.selected}
                  onChange={() => toggleSelectStock(stock.symbol)}
                  disabled={!stock.selected && portfolio.filter(s => s.selected).length >= 2} // Grey out other options
                />
                {stock.symbol}: ${stock.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StockLookup;
