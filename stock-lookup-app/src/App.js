// src/App.js
import React, { useState } from "react";
import StockLookup from "./components/StockLookup";
import StockComparison from "./components/StockComparison";
import { ChakraProvider, Box, Grid, GridItem, Heading } from "@chakra-ui/react";
import Portfolio from "./components/Portfolio";
import StockDetails from "./components/StockDetails"; // Import the StockDetails component

const App = () => {
  const [portfolio, setPortfolio] = useState([]); // State to manage the portfolio of stocks
  const [selectedStocks, setSelectedStocks] = useState([]); // State to manage selected stocks for comparison
  const [selectedStock, setSelectedStock] = useState(null); // State to manage the selected stock for details

  return (
    <ChakraProvider>
      {/* Navigation bar with the stock search */}
      <Box p={5} bg="teal.500" color="white" position="fixed" top={0} width="100%" zIndex="1000" boxShadow="md">
        {/* Flexbox container to center title and search bar */}
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          {/* Centered title */}
          <Heading size="lg" mb={2}>Stock Lookup</Heading>
          
          {/* Centered search bar directly under the title */}
          <StockLookup
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            setSelectedStocks={setSelectedStocks}
            setSelectedStock={setSelectedStock} // Pass the function to set the selected stock
          />
        </Box>
      </Box>

      {/* Main content grid, positioned below the nav bar */}
      <Box p={5} pt="120px" height="100vh" overflow="hidden"> {/* pt="120px" to account for nav height */}
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

          {/* Stock Details Section */}
          <GridItem>
            {/* Show Stock Details if a stock is selected, otherwise show placeholder */}
            <Box height="100%" p={5} borderRadius="md" borderColor="teal.500" borderWidth="1px" boxShadow="md" overflowY="auto">
              {selectedStock ? (
                <StockDetails
                  selectedStock={selectedStock}
                  setPortfolio={setPortfolio}
                  portfolio={portfolio}
                />
              ) : (
                <Box textAlign="center" color="gray.500" mt={10}>
                  <Heading size="md">Select a stock to view details</Heading>
                </Box>
              )}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};

export default App;
