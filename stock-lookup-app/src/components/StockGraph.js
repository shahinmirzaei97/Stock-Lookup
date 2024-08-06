// src/components/StockGraph.js
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockGraph = ({ symbols }) => {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const dataPromises = symbols.map(symbol =>
          fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${process.env.REACT_APP_FMP_API_KEY}`)
            .then(response => response.json())
            .then(data => ({
              symbol,
              historical: data.historical
            }))
        );

        const results = await Promise.all(dataPromises);
        const combinedData = mergeStockData(results);
        setGraphData(combinedData);
      } catch (error) {
        console.error('Error fetching stock graph data:', error);
      }
    };

    fetchGraphData();
  }, [symbols]);

  // Function to merge stock data
  const mergeStockData = (results) => {
    const combinedData = [];
    results[0].historical.forEach((entry, index) => {
      const date = entry.date;
      const dataPoint = { date };

      results.forEach(result => {
        const stockData = result.historical.find(d => d.date === date);
        dataPoint[result.symbol] = stockData ? stockData.close : null;
      });

      combinedData.push(dataPoint);
    });

    // Reverse data to show earliest date at the bottom left
    return combinedData.reverse();
  };

  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={graphData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {symbols.map((symbol, index) => (
            <Line
              key={symbol}
              type="monotone"
              dataKey={symbol}
              stroke={index === 0 ? '#8884d8' : '#82ca9d'}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockGraph;
