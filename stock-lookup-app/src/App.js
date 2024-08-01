// src/App.js
import React, { useState } from 'react';
import StockLookup from './components/StockLookup';
import StockComparison from './components/StockComparison';
import StockGraph from './components/StockGraph';

function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('');

  // Function to add stock to portfolio
  const addStockToPortfolio = (stock) => {
    setPortfolio(prevPortfolio => [...prevPortfolio, stock]);
    setSelectedSymbol(stock.symbol); // Optionally set selected symbol for graph
  };

  console.log('Current portfolio:', portfolio); // Debugging line

  return (
    <div className="App">
      <h1>Stock Price Checker</h1>
      <StockLookup addStockToPortfolio={addStockToPortfolio} />
      <StockComparison stocks={portfolio} />
      {selectedSymbol && <StockGraph symbol={selectedSymbol} />}
    </div>
  );
}

export default App;
