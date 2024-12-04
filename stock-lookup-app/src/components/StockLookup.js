// src/components/StockLookup.js
import React, { useState, useCallback } from 'react';
import { Input, Box, List, ListItem, Button, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { debounce } from '../utils/debounce';

const StockLookup = ({ setPortfolio, setSelectedStock }) => {
  const [symbol, setSymbol] = useState(''); // Track the input value
  const [suggestions, setSuggestions] = useState([]); // Track suggestions from the API
  const [loading, setLoading] = useState(false); // Track loading state for API requests
  const [error, setError] = useState(null); // Track errors

  // Debounced function to fetch stock suggestions
  const fetchSuggestions = useCallback(
    debounce(
      async (query) => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&apikey=${process.env.REACT_APP_FMP_API_KEY}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch suggestions");
          }
          const data = await response.json();
          setSuggestions(data); // Set suggestions from API response
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      500 // 500ms delay for debounce
    ),
    [setLoading, setError, setSuggestions] // Include necessary dependencies
  );

  // Handle input change
  const handleInputChange = (event) => {
    const input = event.target.value.toUpperCase();
    setSymbol(input);
    if (input.length >= 2) {
      fetchSuggestions(input); // Fetch suggestions when input length is >= 2
    } else {
      setSuggestions([]); // Clear suggestions if input length is less than 2
    }
  };

  // Handle selecting a stock to view details
  const handleViewDetails = (symbol) => {
    setSelectedStock(symbol); // Set the selected stock to show its details
    setSuggestions([]); // Clear suggestions once a stock is selected
    setSymbol(''); // Clear the input
  };

  // Handle adding stock to portfolio
  const handleAddToPortfolio = async (symbol) => {
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch stock price');
      const data = await response.json();

      if (data.length > 0) {
        const stockToAdd = {
          symbol: data[0].symbol,
          price: data[0].price,
          quantity: 1,
        };
        setPortfolio((prevPortfolio) => {
          if (!prevPortfolio.some(stock => stock.symbol === stockToAdd.symbol)) {
            return [...prevPortfolio, stockToAdd];
          }
          return prevPortfolio;
        });
      }
    } catch (error) {
      console.error('Error adding stock to portfolio:', error.message);
    }
  };

  return (
    <Box position="relative">
      {/* Search input field */}
      <Input
        value={symbol}
        onChange={handleInputChange}
        placeholder="Enter stock symbol"
        bg="white"
        color="black"
        borderColor="teal.500"
        focusBorderColor="teal.600"
        boxShadow="sm"
        _hover={{ borderColor: 'teal.600' }}
        width="400px"
        mb={4}
      />

      {loading && <Spinner color="teal.600" size="lg" mt={2} />}

      {error && (
        <Alert status="error" mt={4} borderRadius="md" boxShadow="lg">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Displaying the fetched suggestions */}
      {suggestions.length > 0 && (
        <Box
          position="absolute"
          top="60px"
          width="400px"
          maxHeight="200px"
          overflowY="auto"
          bg="white"
          border="1px solid teal.100"
          borderRadius="md"
          boxShadow="md"
          zIndex="1000"
        >
          <List spacing={0}>
            {suggestions.map((s, index) => (
              <ListItem
                key={s.symbol}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                cursor="pointer"
                bg={index % 2 === 0 ? 'teal.50' : 'white'}
                _hover={{ bg: 'teal.100' }}
              >
                <Box color="black" onClick={() => handleViewDetails(s.symbol)}>
                  {s.symbol} - {s.name}
                </Box>
                <Box display="flex" gap={2}>
                  {/* Add to Portfolio Button */}
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleAddToPortfolio(s.symbol)}
                  >
                    +
                  </Button>
                  {/* View Details Button */}
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => handleViewDetails(s.symbol)}
                  >
                    View
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default StockLookup;
