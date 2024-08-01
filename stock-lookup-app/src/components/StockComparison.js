// src/components/StockComparison.js
import React, { useState, useEffect } from 'react';

const StockComparison = ({ stocks }) => {
  const [comparisonData, setComparisonData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data for comparing multiple stocks
  const fetchComparisonData = async () => {
    // Join symbols into a comma-separated list
    const symbols = stocks.map(stock => stock.symbol).join(',');
    console.log('Fetching comparison data for symbols:', symbols); // Debugging line
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Comparison data:', data); // Debugging line
      // Ensure the API returns an array
      if (Array.isArray(data) && data.length > 0) {
        setComparisonData(data);
      } else {
        setComparisonData([]); // Ensure comparison data is an empty array
      }
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching comparison data:', err.message);
      setError(err.message); // Set error message for display
    }
  };

  useEffect(() => {
    if (stocks.length > 0) {
      fetchComparisonData();
    }
  }, [stocks]);

  return (
    <div>
      <h2>Stock Comparison</h2>
      {error && <div>Error: {error}</div>} {/* Display any errors */}
      {comparisonData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>${stock.price.toFixed(2)}</td>
                <td>{(stock.changePercentage || 0).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available for comparison.</p>
      )}
    </div>
  );
};

export default StockComparison;
