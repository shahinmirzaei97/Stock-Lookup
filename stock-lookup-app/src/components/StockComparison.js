// src/components/StockComparison.js
import React from 'react';
import StockGraph from './StockGraph'; // Import the StockGraph component to display graphs

const StockComparison = ({ selectedStocks }) => {
  return (
    <div>
      <h2>Stock Comparison</h2>
      {selectedStocks.length === 2 ? (
        <div>
          <h3>Comparing {selectedStocks[0].symbol} and {selectedStocks[1].symbol}</h3>
          <StockGraph symbols={[selectedStocks[0].symbol, selectedStocks[1].symbol]} />
        </div>
      ) : (
        <div>Select two stocks to compare</div> // Shows this message if fewer than two stocks are selected
      )}
    </div>
  );
};

export default StockComparison;
