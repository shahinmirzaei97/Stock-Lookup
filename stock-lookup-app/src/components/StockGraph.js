// src/components/StockGraph.js
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, FormControl, FormLabel, Button, Flex } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const StockGraph = ({ symbols }) => {
  const [graphData, setGraphData] = useState([]);
  const [dateRange, setDateRange] = useState('1D'); // Default to last day
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 1))); // Start default to one day before today
  const [endDate, setEndDate] = useState(new Date()); // End default to today

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        let query = '';
        
        if (dateRange !== 'custom') {
          query = `timeseries=${getDateRangeLimit(dateRange)}`;
        } else {
          const start = startDate.toISOString().split('T')[0];
          const end = endDate.toISOString().split('T')[0];
          query = `from=${start}&to=${end}`;
        }

        const dataPromises = symbols.map(symbol =>
          fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&${query}&apikey=${process.env.REACT_APP_FMP_API_KEY}`)
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
  }, [symbols, dateRange, startDate, endDate]);

  const mergeStockData = (results) => {
    const combinedData = [];
    if (results[0]?.historical?.length > 0) {
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
      case '1Y':
        return 365;
      case '5Y':
        return 1825;
      default:
        return 1;
    }
  };

  const handleDateRangeClick = (range) => {
    setDateRange(range);
  };

  return (
    <Box>
      {/* Date Range Selection - Predefined Options */}
      <FormControl mb={4}>
        <FormLabel>Date Range Selection</FormLabel>
        <Flex gap={2} wrap="wrap">
          <Button
            size="sm"
            colorScheme={dateRange === '1D' ? 'teal' : 'gray'}
            onClick={() => handleDateRangeClick('1D')}
          >
            Last Day
          </Button>
          <Button
            size="sm"
            colorScheme={dateRange === '1W' ? 'teal' : 'gray'}
            onClick={() => handleDateRangeClick('1W')}
          >
            Last Week
          </Button>
          <Button
            size="sm"
            colorScheme={dateRange === '1M' ? 'teal' : 'gray'}
            onClick={() => handleDateRangeClick('1M')}
          >
            Last Month
          </Button>
          <Button
            size="sm"
            colorScheme={dateRange === '1Y' ? 'teal' : 'gray'}
            onClick={() => handleDateRangeClick('1Y')}
          >
            Last Year
          </Button>
          <Button
            size="sm"
            colorScheme={dateRange === '5Y' ? 'teal' : 'gray'}
            onClick={() => handleDateRangeClick('5Y')}
          >
            Last 5 Years
          </Button>
        </Flex>
      </FormControl>

      {/* Custom Date Range Button */}
      <FormControl mb={4}>
        <Flex alignItems="center" gap={2}>
          <Button
            size="sm"
            colorScheme={dateRange === 'custom' ? 'teal' : 'gray'}
            onClick={() => handleDateRangeClick('custom')}
          >
            Custom
          </Button>
          {/* Custom Date Picker - Visible Only When Custom Date Range is Selected */}
          {dateRange === 'custom' && (
            <Flex gap={2} alignItems="center">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={new Date()}
                dateFormat="yyyy/MM/dd"
                className="custom-datepicker"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                dateFormat="yyyy/MM/dd"
                className="custom-datepicker"
              />
            </Flex>
          )}
        </Flex>
      </FormControl>

      {/* Line Chart for Stock Data */}
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
