//  src/components/StockComparison.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Grid, GridItem, Button, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import StockGraph from './StockGraph'; // Import the StockGraph component to display graphs

const StockComparison = ({ selectedStocks, setSelectedStock }) => {
  const [stockDetails, setStockDetails] = useState([]); // State to store details of selected stocks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const detailsPromises = selectedStocks.map(stock =>
          fetch(`https://financialmodelingprep.com/api/v3/profile/${stock}?apikey=${process.env.REACT_APP_FMP_API_KEY}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => (data.length > 0 ? data[0] : null)) // Extract the first item from the response array
        );

        const details = await Promise.all(detailsPromises);
        const validDetails = details.filter(detail => detail !== null); // Filter out any null responses
        setStockDetails(validDetails);
      } catch (error) {
        setError('Error fetching stock details for comparison. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedStocks.length === 2) {
      fetchStockDetails(); // Fetch details when two stocks are selected
    } else {
      setStockDetails([]); // Clear stock details if less than two stocks are selected
    }
  }, [selectedStocks]);

  return (
    <Box p={5} mt={8} maxWidth="800px" mx="auto" textAlign="center">
      <Heading size="lg" mb={4} textAlign="center">Stock Comparison</Heading>

      {loading && <Spinner color="teal.600" size="lg" />}
      {error && (
        <Alert status="error" mb={4} borderRadius="md" boxShadow="lg">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {selectedStocks.length === 2 && stockDetails.length === 2 ? (
        <Box>
          <Heading size="md" mb={4} textAlign="center">
            Comparing {stockDetails[0].companyName} and {stockDetails[1].companyName}
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
            {stockDetails.map(stock => (
              <GridItem key={stock.symbol} border="1px solid #ccc" borderRadius="md" p={4} display="flex" flexDirection="column" justifyContent="space-between">
                <Box mb={4}>
                  <Heading size="md" mb={2}>{stock.companyName}</Heading>
                  <Text><strong>Symbol:</strong> {stock.symbol}</Text>
                  <Text><strong>Price:</strong> ${stock.price}</Text>
                  <Text><strong>Industry:</strong> {stock.industry}</Text>
                  <Text><strong>Sector:</strong> {stock.sector}</Text>
                  <Text><strong>CEO:</strong> {stock.ceo}</Text>
                </Box>
                <Button
                  colorScheme="teal"
                  alignSelf="center"
                  mt="auto"
                  onClick={() => setSelectedStock(stock.symbol)}
                >
                  View Stock Details
                </Button>
              </GridItem>
            ))}
          </Grid>
          <StockGraph symbols={selectedStocks} />
        </Box>
      ) : (
        <Text>Select two stocks to compare.</Text>
      )}
    </Box>
  );
};

export default StockComparison;
