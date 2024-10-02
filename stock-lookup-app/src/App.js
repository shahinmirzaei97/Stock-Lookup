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

  // Function to toggle the selection state of a stock for comparison
  const toggleSelectStock = (symbol) => {
    setPortfolio((prevPortfolio) => {
      return prevPortfolio.map(stock =>
        stock.symbol === symbol ? { ...stock, selected: !stock.selected } : stock
      );
    });

    setSelectedStocks((prevSelectedStocks) => {
      if (prevSelectedStocks.includes(symbol)) {
        // Remove the stock from selected stocks if it was already selected
        return prevSelectedStocks.filter(stockSymbol => stockSymbol !== symbol);
      }
      if (prevSelectedStocks.length < 2) {
        // Add the stock to selected stocks if the limit hasn't been reached
        return [...prevSelectedStocks, symbol];
      }
      return prevSelectedStocks;
    });
  };

  return (
    <ChakraProvider>
      {/* Navigation bar with the stock search */}
      <Box p={5} bg="teal.500" color="white" position="fixed" top={0} width="100%" zIndex="1000" boxShadow="md">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Heading size="lg" mb={2}>Stock Lookup</Heading>
          <StockLookup
            setPortfolio={setPortfolio}
            setSelectedStock={setSelectedStock} // Pass the function to set the selected stock
          />
        </Box>
      </Box>

      {/* Main content grid, positioned below the nav bar */}
      <Box p={5} pt="120px" height="calc(100vh - 120px)" overflowY="auto">
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={6}
          height="100%"
        >
          {/* Portfolio Section */}
          <GridItem>
            <Box
              height="100%"
              p={5}
              borderRadius="md"
              borderColor="teal.500"
              borderWidth="2px"
              boxShadow="md"
              overflowY="auto"
            >
              <Portfolio
                portfolio={portfolio}
                setPortfolio={setPortfolio}
                toggleSelectStock={toggleSelectStock} // Pass toggleSelectStock to Portfolio
              />
            </Box>
          </GridItem>

          {/* Stock Comparison Section */}
          <GridItem>
            <Box
              height="100%"
              p={5}
              borderRadius="md"
              borderColor="teal.500"
              borderWidth="1px"
              boxShadow="md"
              overflowY="auto"
            >
              <StockComparison selectedStocks={selectedStocks} setSelectedStock={setSelectedStock} />
            </Box>
          </GridItem>

          {/* Stock Details Section */}
          <GridItem>
            <Box
              height="100%"
              p={5}
              borderRadius="md"
              borderColor="teal.500"
              borderWidth="1px"
              boxShadow="md"
              overflowY="auto"
            >
              {selectedStock ? (
                <StockDetails
                  selectedStock={selectedStock}
                  setPortfolio={setPortfolio}
                  portfolio={portfolio}
                  isInPortfolio={portfolio.some(stock => stock.symbol === selectedStock)}
                  onAddToPortfolio={(symbol) => {
                    setPortfolio([...portfolio, { symbol, price: 0, quantity: 1 }]); // Add a new stock (default price to 0)
                  }}
                  onRemoveFromPortfolio={(symbol) => {
                    setPortfolio(portfolio.filter(stock => stock.symbol !== symbol));
                  }}
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
