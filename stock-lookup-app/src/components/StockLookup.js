// src/components/StockLookup.js
import React, { useState, useCallback } from 'react';
import { Box, Input, List, ListItem, Heading, Spinner, Alert, AlertIcon, Button } from '@chakra-ui/react';
import StockDetails from './StockDetails';
import { debounce } from '../utils/debounce'; // Import the debounce utility

const StockLookup = ({ portfolio, setPortfolio, setSelectedStocks }) => {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  // Debounced function to fetch suggestions
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&apikey=${process.env.REACT_APP_FMP_API_KEY}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms delay for debounce
    []
  );

  const handleInputChange = (event) => {
    const input = event.target.value.toUpperCase();
    setSymbol(input);
    if (input.length >= 2) {
      fetchSuggestions(input); // Fetch stock suggestions with debounce
    } else {
      setSuggestions([]);
    }
  };

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
        quantity: 1, // Add quantity with a default value of 1
      };
      if (!portfolio.find(stock => stock.symbol === newStock.symbol)) {
        setPortfolio([...portfolio, newStock]);
      }
      setSymbol('');
      setSuggestions([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStockClick = (symbol) => {
    setSelectedStock(symbol);
  };

  return (
    <Box p={5} borderRadius="md" borderColor="teal.500" borderWidth="2px" boxShadow="md">
      <Heading mb={5} color="teal.700" fontSize="2xl" textAlign="center">Stock Price Lookup</Heading>
      <Input
        value={symbol}
        onChange={handleInputChange}
        placeholder="Enter stock symbol"
        mb={4}
        borderColor="teal.500"
        focusBorderColor="teal.600"
        boxShadow="sm"
        _hover={{ borderColor: 'teal.600' }}
      />
      {loading && <Spinner color="teal.600" size="lg" />}
      {error && (
        <Alert status="error" mb={4} borderRadius="md" boxShadow="lg">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {suggestions.length > 0 && (
        <Box maxHeight="150px" overflowY="auto" mb={4} border="1px solid teal.100" borderRadius="md" boxShadow="sm">
          <List spacing={3}>
            {suggestions.map((s, index) => (
              <ListItem 
                key={s.symbol} 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
                onClick={() => handleStockClick(s.symbol)}
                bg={index % 2 === 0 ? 'teal.50' : 'white'}
                borderBottom="1px solid teal.100"
                p={2}
                cursor="pointer"
                _hover={{ bg: 'teal.100' }}
              >
                {s.symbol} - {s.name}
                <Button 
                  onClick={(e) => { e.stopPropagation(); addStockToPortfolio(s.symbol); }} 
                  colorScheme="teal" 
                  size="sm" 
                  variant="solid"
                  boxShadow="sm"
                >
                  Add
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {selectedStock && (
        <Box mt={6} bg="gray.50" p={5} borderRadius="md" borderColor="teal.500" borderWidth="1px" boxShadow="md">
          <StockDetails
            selectedStock={selectedStock}
            onAddToPortfolio={addStockToPortfolio}
            isInPortfolio={portfolio.some(stock => stock.symbol === selectedStock)}
          />
        </Box>
      )}
    </Box>
  );
};

export default StockLookup;
