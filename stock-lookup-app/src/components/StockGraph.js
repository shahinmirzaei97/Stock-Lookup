// src/components/StockGraph.js
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Select } from 'recharts';
import { Box, FormControl, FormLabel, Select as ChakraSelect } from '@chakra-ui/react';

const StockGraph = ({ symbols }) => {
  const [graphData, setGraphData] = useState([]);
  const [dateRange, setDateRange] = useState('1D'); // Default to last day

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const dataPromises = symbols.map(symbol =>
          fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&timeseries=${getDateRangeLimit(dateRange)}&apikey=${process.env.REACT_APP_FMP_API_KEY}`)
            .then(response => response.json())
            .then(data => ({
              symbol,
              historical: data.historical || []
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
  }, [symbols, dateRange]);

  const mergeStockData = (results) => {
    const combinedData = [];
    if (results[0].historical.length > 0) {
      results[0].historical.forEach((entry) => {
        const date = entry.date;
        const dataPoint = { date };
        results.forEach(result => {
          const stockData = result.historical.find(d => d.date === date);
          dataPoint[result.symbol] = stockData ? stockData.close : null;
        });
        combinedData.push(dataPoint);
      });
    }
    return combinedData.reverse();
  };

  const getDateRangeLimit = (range) => {
    switch (range) {
      case '1D':
        return 1;
      case '1W':
        return 7;
      case '1M':
        return 30;
      case '3M':
        return 90;
      case '1Y':
        return 365;
      case '5Y':
        return 1825;
      default:
        return 1;
    }
  };

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel>Select Date Range</FormLabel>
        <ChakraSelect value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          <option value="1D">Last Day</option>
          <option value="1W">Last Week</option>
          <option value="1M">Last Month</option>
          <option value="3M">Last Quarter</option>
          <option value="1Y">Last Year</option>
          <option value="5Y">Last 5 Years</option>
        </ChakraSelect>
      </FormControl>

      <ResponsiveContainer width="100%" height={300}>
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
    </Box>
  );
};

export default StockGraph;
