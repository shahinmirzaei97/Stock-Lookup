// src/components/StockComparison.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Grid, GridItem } from '@chakra-ui/react';
import StockGraph from './StockGraph'; // Import the StockGraph component to display graphs

const StockComparison = ({ selectedStocks }) => {
  const [stockDetails, setStockDetails] = useState([]); // State to store details of selected stocks

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const detailsPromises = selectedStocks.map(stock =>
          fetch(`https://financialmodelingprep.com/api/v3/profile/${stock.symbol}?apikey=${process.env.REACT_APP_FMP_API_KEY}`)
            .then(response => response.json())
            .then(data => data[0]) // Extract the first item from the response array
        );

        const details = await Promise.all(detailsPromises);
        setStockDetails(details);
      } catch (error) {
        console.error('Error fetching stock details:', error);
      }
    };

    if (selectedStocks.length === 2) {
      fetchStockDetails(); // Fetch details when two stocks are selected
    }
  }, [selectedStocks]);

  return (
    <Box p={5} mt={8} maxWidth="800px" mx="auto">
      <Heading size="lg" mb={4}>Stock Comparison</Heading>
      {selectedStocks.length === 2 ? (
        <Box>
          <Heading size="md" mb={4}>
            Comparing {selectedStocks[0].symbol} and {selectedStocks[1].symbol}
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
            {stockDetails.map(stock => (
              <GridItem key={stock.symbol} border="1px solid #ccc" borderRadius="md" p={4}>
                <Heading size="md" mb={2}>{stock.companyName}</Heading>
                <Text><strong>Symbol:</strong> {stock.symbol}</Text>
                <Text><strong>Price:</strong> ${stock.price}</Text>
                <Text><strong>Industry:</strong> {stock.industry}</Text>
                <Text><strong>Sector:</strong> {stock.sector}</Text>
                <Text><strong>CEO:</strong> {stock.ceo}</Text>
              </GridItem>
            ))}
          </Grid>
          <StockGraph symbols={[selectedStocks[0].symbol, selectedStocks[1].symbol]} />
        </Box>
      ) : (
        <Text>Select two stocks to compare.</Text>
      )}
    </Box>
  );
};

export default StockComparison;
