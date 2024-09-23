// src/components/StockLookup.js
import React, { useState, useCallback } from 'react';
import { Input, Box, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { debounce } from '../utils/debounce'; // Import the debounce utility

const StockLookup = ({ setPortfolio, setSelectedStock }) => {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced function to fetch suggestions
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      setLoading(true);
      setError(null);
      // Fetch suggestions logic here...
      setLoading(false);
    }, 500), // 500ms delay for debounce
    []
  );

  const handleInputChange = (event) => {
    const input = event.target.value.toUpperCase();
    setSymbol(input);
    if (input.length >= 2) {
      fetchSuggestions(input); // Fetch stock suggestions with debounce
    }
  };

  return (
    <Box>
      <Input
        value={symbol}
        onChange={handleInputChange}
        placeholder="Enter stock symbol"
        bg="white"  // White background for better readability
        color="black"  // Black text inside the input for contrast
        borderColor="teal.500"
        focusBorderColor="teal.600"
        boxShadow="sm"
        _hover={{ borderColor: 'teal.600' }}
        width="300px"  // Set a fixed width for better layout
      />
      {loading && <Spinner color="teal.600" size="lg" />}
      {error && (
        <Alert status="error" mb={4} borderRadius="md" boxShadow="lg">
          <AlertIcon />
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default StockLookup;
