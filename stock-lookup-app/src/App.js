// src/App.js
import React, { useState } from "react";
import StockLookup from "./components/StockLookup";
import StockComparison from "./components/StockComparison";
import { ChakraProvider } from "@chakra-ui/react";

const App = () => {
  const [portfolio, setPortfolio] = useState([]); // State to manage the portfolio of stocks
  const [selectedStocks, setSelectedStocks] = useState([]); // State to manage selected stocks for comparison

  return (
    <ChakraProvider>
      <div>
        <StockLookup
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          setSelectedStocks={setSelectedStocks}
        />
        <StockComparison selectedStocks={selectedStocks} />
      </div>
    </ChakraProvider>
  );
};

export default App;
