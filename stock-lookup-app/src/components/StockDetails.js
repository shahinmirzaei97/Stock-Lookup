// src/components/StockDetails.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Button, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import StockGraph from './StockGraph'; // Import the graph component

const StockDetails = ({ selectedStock, onAddToPortfolio, onRemoveFromPortfolio, isInPortfolio }) => {
  const [stockDetails, setStockDetails] = useState(null); // Stores detailed stock information
  const [graphData, setGraphData] = useState([]); // Stores data for the graph
  const [loading, setLoading] = useState(false); // Indicates whether data is being loaded
  const [error, setError] = useState(null); // Stores any errors that occur during data fetching

  // Fetch stock details and graph data when the selected stock changes
  useEffect(() => {
    const fetchStockDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch detailed stock information
        const detailsResponse = await fetch(`https://financialmodelingprep.com/api/v3/profile/${selectedStock}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
        if (!detailsResponse.ok) throw new Error('Network response was not ok');
        const detailsData = await detailsResponse.json();

        // Fetch historical price data for the graph
        const graphResponse = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${selectedStock}?serietype=line&apikey=${process.env.REACT_APP_FMP_API_KEY}`);
        if (!graphResponse.ok) throw new Error('Network response was not ok');
        const graphData = await graphResponse.json();

        setStockDetails(detailsData[0]);
        setGraphData(graphData.historical);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [selectedStock]);

  return (
    <Box p={5} maxWidth="800px" mx="auto">
      {loading && <Spinner />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      {stockDetails && (
        <Box>
          <Heading size="lg" mb={4}>{stockDetails.companyName}</Heading>
          <Text><strong>Symbol:</strong> {stockDetails.symbol}</Text>
          <Text><strong>Price:</strong> ${stockDetails.price}</Text>
          <Text><strong>Industry:</strong> {stockDetails.industry}</Text>
          <Text><strong>Sector:</strong> {stockDetails.sector}</Text>
          <Text><strong>CEO:</strong> {stockDetails.ceo}</Text>
          <Text><strong>Description:</strong> {stockDetails.description}</Text>

          {/* Display the stock graph */}
          <StockGraph symbols={[selectedStock]} />

          {/* Button to add or remove stock from the portfolio */}
          <Button
            onClick={() => isInPortfolio ? onRemoveFromPortfolio(selectedStock) : onAddToPortfolio(selectedStock)}
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