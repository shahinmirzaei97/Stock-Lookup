// src/components/Portfolio.js
import React from 'react';
import { Box, List, ListItem, Heading, Checkbox, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Text } from '@chakra-ui/react';

const Portfolio = ({ portfolio, setPortfolio, toggleSelectStock, removeStockFromPortfolio }) => {
  // Calculate the total portfolio value
  const portfolioValue = portfolio.reduce((acc, stock) => acc + (stock.price * stock.quantity || 1), 0);

  // Function to adjust the quantity of stocks in the portfolio
  const handleQuantityChange = (symbol, value) => {
    const updatedPortfolio = portfolio.map(stock =>
      stock.symbol === symbol ? { ...stock, quantity: value } : stock
    );
    setPortfolio(updatedPortfolio);
  };

  return (
    <Box p={5} borderRadius="md" borderColor="teal.500" borderWidth="2px" boxShadow="md">
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
              <Box mr={3}>{stock.symbol}: ${stock.price}</Box>

              {/* Number of stocks (Quantity) */}
              <NumberInput
                defaultValue={stock.quantity || 1}
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

            <Button 
              onClick={() => removeStockFromPortfolio(stock.symbol)} 
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
