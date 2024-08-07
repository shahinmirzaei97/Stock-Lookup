// src/components/StockComparison.js
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import StockGraph from './StockGraph'; // Import the StockGraph component to display graphs

const StockComparison = ({ selectedStocks }) => {
  return (
    <Box p={5} mt={8} maxWidth="800px" mx="auto">
      <Heading size="lg" mb={4}>Stock Comparison</Heading>
      {selectedStocks.length === 2 ? (
        <Box>
          <Heading size="md" mb={4}>
            Comparing {selectedStocks[0].symbol} and {selectedStocks[1].symbol}
          </Heading>
          <StockGraph symbols={[selectedStocks[0].symbol, selectedStocks[1].symbol]} />
        </Box>
      ) : (
        <Text>Select two stocks to compare.</Text>
      )}
    </Box>
  );
};

export default StockComparison;