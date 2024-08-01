// src/components/StockGraph.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockGraph = ({ symbol }) => {
  // State for storing historical stock data
  const [data, setData] = useState([]);

  // Fetch historical price data for graphing
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      const chartData = json.historical.map(item => ({
        date: item.date,
        close: item.close,
      }));
      setData(chartData); // Set data for graph
    } catch (err) {
      console.error('Error fetching historical data:', err.message);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchHistoricalData();
    }
  }, [symbol]);

  return (
    <div>
      <h2>{symbol} Price History</h2>
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="close" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockGraph;
