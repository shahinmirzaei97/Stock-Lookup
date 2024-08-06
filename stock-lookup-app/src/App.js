// src/App.js
import React, { useState } from 'react';
import StockLookup from './components/StockLookup';
import StockComparison from './components/StockComparison';

const App = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);

  return (
    <div>
      <h1>Stock Portfolio App</h1>
      <StockLookup 
        portfolio={portfolio} 
        setPortfolio={setPortfolio} 
        setSelectedStocks={setSelectedStocks}
      />
      <StockComparison selectedStocks={selectedStocks} />
    </div>
  );
};

export default App;
