// src/components/StockDetails.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Button, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import StockGraph from './StockGraph'; // Import the graph component
import { addStockToPortfolio, removeStockFromPortfolio } from '../utils/portfolioUtils';

const StockDetails = ({ selectedStock, setPortfolio, isInPortfolio }) => {
  const [stockDetails, setStockDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch detailed stock information
        const detailsResponse = await fetch(`https://financialmodelingprep.com/api/v3/profile/${selectedStock}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
        if (!detailsResponse.ok) throw new Error('Network response was not ok');
        const detailsData = await detailsResponse.json();

        setStockDetails(detailsData[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [selectedStock]);

  return (
    <Box p={5} bg="gray.50" borderRadius="md" borderColor="teal.500" borderWidth="1px" boxShadow="md" height="100%" overflowY="auto">
      {loading && <Spinner color="teal.600" />}
      {error && (
        <Alert status="error" mb={4} borderRadius="md" boxShadow="lg">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {stockDetails && (
        <Box height="100%" overflowY="auto" display="flex" flexDirection="column">
          <Heading size="lg" mb={4} color="teal.700">{stockDetails.companyName}</Heading>
          <Text><strong>Symbol:</strong> {stockDetails.symbol}</Text>
          <Text><strong>Price:</strong> ${stockDetails.price}</Text>
          <Text><strong>Industry:</strong> {stockDetails.industry}</Text>
          <Text><strong>Sector:</strong> {stockDetails.sector}</Text>
          <Text><strong>CEO:</strong> {stockDetails.ceo}</Text>
          <Text><strong>Description:</strong> {stockDetails.description}</Text>

          {/* Display the stock graph */}
          <Box mt={4} flex="1 1 auto">
            <StockGraph symbols={[selectedStock]} />
          </Box>

          {/* Button to add or remove stock from the portfolio */}
          <Button
        onClick={() => isInPortfolio 
          ? removeStockFromPortfolio(selectedStock, setPortfolio) 
          : addStockToPortfolio(selectedStock, setPortfolio)}
        colorScheme={isInPortfolio ? "red" : "teal"}
        mt={4}
      >
        {isInPortfolio ? 'Remove from Portfolio' : 'Add to Portfolio'}
      </Button>
        </Box>
      )}
    </Box>
  );
};

export default StockDetails;
