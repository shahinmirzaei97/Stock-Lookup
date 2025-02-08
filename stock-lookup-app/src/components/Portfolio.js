import React from 'react';
import { Box, List, ListItem, Button, Heading, Text, Checkbox } from '@chakra-ui/react';
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';

const Portfolio = ({ portfolio, setPortfolio, toggleSelectStock }) => {

  // Calculate total portfolio value correctly
  const portfolioValue = portfolio.reduce(
    (sum, stock) => sum + (stock.price * stock.quantity), 
    0
  );

  // Handle quantity changes for stocks
  const handleQuantityChange = (symbol, quantity) => {
    setPortfolio(prevPortfolio =>
      prevPortfolio.map(stock =>
        stock.symbol === symbol ? { ...stock, quantity } : stock
      )
    );
  };

  // ✅ Correctly handle removing stock from portfolio
  const handleRemoveStock = (symbol) => {
    setPortfolio((prevPortfolio) => prevPortfolio.filter(stock => stock.symbol !== symbol));
  };

  return (
    <Box p={5} borderRadius="md" borderColor="teal.500" borderWidth="2px" boxShadow="md" width="300px" height="400px" overflowY="auto">
      <Heading size="md" mb={3} color="teal.700">Your Portfolio</Heading>

      {/* Portfolio Value */}
      <Text fontWeight="bold" mb={4}>Total Value: ${portfolioValue.toFixed(2)}</Text>

      <List spacing={3}>
        {portfolio.map((stock) => (
          <ListItem 
            key={stock.symbol} 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            bg="gray.50" 
            p={2} 
            borderRadius="md" 
            boxShadow="sm"
            _hover={{ bg: 'teal.50' }}
          >
            <Box display="flex" alignItems="center">
              <Checkbox
                isChecked={stock.selected}
                onChange={() => toggleSelectStock(stock.symbol)}
                isDisabled={!stock.selected && portfolio.filter(s => s.selected).length >= 2}
                mr={3}
                colorScheme="teal"
              />
              <Box mr={3}>{stock.symbol}: ${stock.price.toFixed(2)}</Box>

              {/* Number of stocks (Quantity) */}
              <NumberInput
                value={stock.quantity}  // Ensure dynamic updates
                min={1}
                max={100}
                onChange={(value) => handleQuantityChange(stock.symbol, Number(value))}
                size="sm"
                maxW={20}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>

            {/* ✅ Fixed Remove Stock Functionality */}
            <Button 
              onClick={() => handleRemoveStock(stock.symbol)} 
              colorScheme="red" 
              size="sm"
              boxShadow="sm"
            >
              Remove
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Portfolio;
