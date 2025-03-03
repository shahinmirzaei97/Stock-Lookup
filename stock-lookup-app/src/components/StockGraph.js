import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const StockGraph = ({ symbols }) => {
  const [graphData, setGraphData] = useState([]);
  const [dateRange, setDateRange] = useState('1D');
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = '';
        
        if (dateRange === 'custom') {
          const start = startDate.toISOString().split('T')[0];
          const end = endDate.toISOString().split('T')[0];
          query = `from=${start}&to=${end}`;
        } else {
          query = `timeseries=${getDateRangeLimit(dateRange)}`;
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
        setGraphData(mergeStockData(results));
      } catch (error) {
        setError('Error fetching stock graph data.');
      } finally {
        setLoading(false);
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
      case '1D': return 1;
      case '1W': return 7;
      case '1M': return 30;
      case '1Y': return 365;
      case '5Y': return 1825;
      default: return 1;
    }
  };

  return (
    <Card className="shadow-sm mt-4">
      <Card.Header className="bg-primary text-white text-center">Stock Graph</Card.Header>
      <Card.Body>
        {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="d-flex justify-content-center gap-2 flex-wrap mb-3">
          {['1D', '1W', '1M', '1Y', '5Y', 'custom'].map(range => (
            <Button
              key={range}
              variant={dateRange === range ? 'primary' : 'outline-primary'}
              onClick={() => setDateRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
        
        {dateRange === 'custom' && (
          <div className="d-flex justify-content-center gap-2">
            <DatePicker selected={startDate} onChange={setStartDate} selectsStart startDate={startDate} endDate={endDate} className="form-control" />
            <DatePicker selected={endDate} onChange={setEndDate} selectsEnd startDate={startDate} endDate={endDate} className="form-control" />
          </div>
        )}
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {symbols.map((symbol, index) => (
              <Line key={symbol} type="monotone" dataKey={symbol} stroke={index === 0 ? '#8884d8' : '#82ca9d'} strokeWidth={2} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default StockGraph;