// src/components/StockLookup.js
import React, { useState } from 'react';
import { Box, Input, List, ListItem, Heading, Spinner, Alert, AlertIcon, Button } from '@chakra-ui/react';
import Portfolio from './Portfolio'; // Import the renamed Portfolio component
import StockDetails from './StockDetails'; // Import the StockDetails component

const StockLookup = ({ portfolio, setPortfolio, setSelectedStocks }) => {
  const [symbol, setSymbol] = useState(''); // Manages the input field value for stock symbols
  const [suggestions, setSuggestions] = useState([]); // Stores stock symbol suggestions based on user input
  const [loading, setLoading] = useState(false); // Indicates whether data is being loaded
  const [error, setError] = useState(null); // Stores any errors that occur during data fetching
  const [selectedStock, setSelectedStock] = useState(null); // Manages the currently selected stock for detailed view

  // Handles changes in the input field
  const handleInputChange = (event) => {
    const input = event.target.value.toUpperCase();
    setSymbol(input);
    if (input.length >= 2) {
      fetchSuggestions(input); // Fetch stock suggestions when input length is 2 or more
    } else {
      setSuggestions([]); // Clear suggestions if input length is less than 2
    }
  };

  // Fetches stock symbol suggestions from the API
  const fetchSuggestions = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&apikey=${process.env.REACT_APP_FMP_API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSuggestions(data); // Set the fetched suggestions
    } catch (err) {
      setError(err.message); // Set the error message if fetching fails
    } finally {
      setLoading(false);
    }
  };

  // Adds a stock to the portfolio
  const addStockToPortfolio = async (ticker) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('Stock symbol not found');
      }
      const newStock = {
        symbol: data[0].symbol,
        price: data[0].price,
        selected: false,
      };
      if (!portfolio.find(stock => stock.symbol === newStock.symbol)) {
        setPortfolio([...portfolio, newStock]); // Add the stock to the portfolio if it does not already exist
      }
      setSymbol(''); // Clear the input field
      setSuggestions([]); // Clear the suggestions list
    } catch (err) {
      setError(err.message); // Set the error message if adding stock fails
    } finally {
      setLoading(false);
    }
  };

  // Sets the selected stock for detailed view
  const handleStockClick = (symbol) => {
    setSelectedStock(symbol);
  };

  // Toggles the selection state of a stock
  const toggleSelectStock = (symbol) => {
    const selectedCount = portfolio.filter(stock => stock.selected).length;
    const updatedPortfolio = portfolio.map(stock =>
      stock.symbol === symbol 
        ? { ...stock, selected: !stock.selected } 
        : selectedCount < 2 || stock.selected 
          ? stock 
          : { ...stock, selected: false }
    );
    setPortfolio(updatedPortfolio); // Update the portfolio with the new selection state
    setSelectedStocks(updatedPortfolio.filter(stock => stock.selected)); // Update selected stocks for comparison
  };

  // Remove a stock from the portfolio
  const removeStockFromPortfolio = (symbol) => {
    setPortfolio(portfolio.filter(stock => stock.symbol !== symbol));
    setSelectedStocks(selectedStocks => selectedStocks.filter(stock => stock.symbol !== symbol));
  };

  // Function to handle adding stock to portfolio from StockDetails component
  const handleAddToPortfolio = (symbol) => {
    addStockToPortfolio(symbol);
  };

  // Function to handle removing stock from portfolio from StockDetails component
  const handleRemoveFromPortfolio = (symbol) => {
    removeStockFromPortfolio(symbol);
  };

  return (
    <Box p={5} maxWidth="1200px" mx="auto" display="flex">
      <Box flex="1" maxWidth="300px" mr={5} bg="gray.50" p={4} borderRadius="md" borderColor="teal.400" borderWidth="1px">
        <Portfolio 
          portfolio={portfolio}
          toggleSelectStock={toggleSelectStock}
          removeStockFromPortfolio={removeStockFromPortfolio}
        />
      </Box>
      <Box flex="2">
        <Heading mb={4} color="teal.600">Stock Price Lookup</Heading>
        <Input
          value={symbol}
          onChange={handleInputChange}
          placeholder="Enter stock symbol"
          mb={4}
          borderColor="teal.400"
          focusBorderColor="teal.500"
        />
        {loading && <Spinner color="teal.500" />}
        {error && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        {suggestions.length > 0 && (
          <Box maxHeight="150px" overflowY="auto" mb={4} border="1px solid lightgray" borderRadius="md">
            <List spacing={3}>
              {suggestions.map((s, index) => (
                <ListItem 
                  key={s.symbol} 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  onClick={() => handleStockClick(s.symbol)}
                  bg={index % 2 === 0 ? 'gray.50' : 'white'}
                  borderBottom="1px solid lightgray"
                  p={2}
                  cursor="pointer"
                  _hover={{ bg: 'teal.50' }}
                >
                  {s.symbol} - {s.name}
                  <Button 
                    onClick={(e) => { e.stopPropagation(); addStockToPortfolio(s.symbol); }} 
                    colorScheme="teal" 
                    size="sm" 
                    variant="outline"
                  >
                    Add
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        {selectedStock && (
          <StockDetails
            selectedStock={selectedStock}
            onAddToPortfolio={handleAddToPortfolio}
            onRemoveFromPortfolio={handleRemoveFromPortfolio}
            isInPortfolio={portfolio.some(stock => stock.symbol === selectedStock)}
          />
        )}
        <Box mt={6}>
          {/* Stock comparison section remains here */}
          {/* Add your stock comparison code here */}
        </Box>
      </Box>
    </Box>
  );
};

export default StockLookup;
