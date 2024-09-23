// src/App.js
import React, { useState } from "react";
import StockLookup from "./components/StockLookup";
import StockComparison from "./components/StockComparison";
import { ChakraProvider, Box, Grid, GridItem } from "@chakra-ui/react";
import Portfolio from "./components/Portfolio";

const App = () => {
  const [portfolio, setPortfolio] = useState([]); // State to manage the portfolio of stocks
  const [selectedStocks, setSelectedStocks] = useState([]); // State to manage selected stocks for comparison

  return (
    <ChakraProvider>
      <Box p={5} height="100vh" overflow="hidden">
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={6}
          height="100%"
          templateRows="1fr"
        >
          {/* Portfolio Section */}
          <GridItem>
            <Portfolio
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              setSelectedStocks={setSelectedStocks}
            />
          </GridItem>

          {/* Stock Comparison Section */}
          <GridItem>
            <StockComparison selectedStocks={selectedStocks} />
          </GridItem>

          {/* Stock Lookup Section */}
          <GridItem>
            <StockLookup
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              setSelectedStocks={setSelectedStocks}
            />
          </GridItem>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};

export default App;
