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

  // Function to fetch stock price before adding to portfolio
  const fetchStockPrice = async (symbol) => {
    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${process.env.REACT_APP_FMP_API_KEY}`
      );
      if (!response.ok) throw new Error("Failed to fetch stock price");

      const data = await response.json();
      if (data.length > 0 && data[0].price !== undefined) {
        return parseFloat(data[0].price); // Ensure price is correctly stored
      }
    } catch (error) {
      console.error("Error fetching stock price:", error.message);
    }
    return 0; // Default to 0 if fetching fails
  };

  // Function to add a stock to the portfolio
  const onAddToPortfolio = async (symbol) => {
    const price = await fetchStockPrice(symbol); // Fetch the correct price

    setPortfolio((prevPortfolio) => {
      if (!prevPortfolio.some((stock) => stock.symbol === symbol)) {
        return [...prevPortfolio, { symbol, price, quantity: 1 }];
      }
      return prevPortfolio;
    });
  };

  // Function to remove a stock from the portfolio
  const onRemoveFromPortfolio = (symbol) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.filter((stock) => stock.symbol !== symbol)
    );
  };

  // Function to toggle the selection state of a stock for comparison
  const toggleSelectStock = (symbol) => {
    setPortfolio((prevPortfolio) => {
      return prevPortfolio.map((stock) =>
        stock.symbol === symbol ? { ...stock, selected: !stock.selected } : stock
      );
    });

    setSelectedStocks((prevSelectedStocks) => {
      if (prevSelectedStocks.includes(symbol)) {
        return prevSelectedStocks.filter((stockSymbol) => stockSymbol !== symbol);
      }
      if (prevSelectedStocks.length < 2) {
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
          <StockLookup setPortfolio={setPortfolio} setSelectedStock={setSelectedStock} />
        </Box>
      </Box>

      {/* Main content grid, positioned below the nav bar */}
      <Box p={5} pt="120px" height="calc(100vh - 120px)" overflowY="auto">
        <Grid templateColumns="repeat(3, 1fr)" gap={6} height="100%">
          {/* Portfolio Section */}
          <GridItem>
            <Box height="100%" p={5} borderRadius="md" borderColor="teal.500" borderWidth="2px" boxShadow="md" overflowY="auto">
              <Portfolio portfolio={portfolio} setPortfolio={setPortfolio} toggleSelectStock={toggleSelectStock} />
            </Box>
          </GridItem>

          {/* Stock Comparison Section */}
          <GridItem>
            <Box height="100%" p={5} borderRadius="md" borderColor="teal.500" borderWidth="1px" boxShadow="md" overflowY="auto">
              <StockComparison selectedStocks={selectedStocks} setSelectedStock={setSelectedStock} />
            </Box>
          </GridItem>

          {/* Stock Details Section */}
          <GridItem>
            <Box height="100%" p={5} borderRadius="md" borderColor="teal.500" borderWidth="1px" boxShadow="md" overflowY="auto">
              {selectedStock ? (
                <StockDetails
                  selectedStock={selectedStock}
                  setPortfolio={setPortfolio}
                  portfolio={portfolio}
                  isInPortfolio={portfolio.some((stock) => stock.symbol === selectedStock)}
                  onAddToPortfolio={onAddToPortfolio} // ✅ Pass correct function
                  onRemoveFromPortfolio={onRemoveFromPortfolio} // ✅ Pass correct function
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
