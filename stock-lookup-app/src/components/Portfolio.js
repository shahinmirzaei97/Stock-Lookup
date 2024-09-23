// src/components/Portfolio.js
import React from 'react';
import { Box, List, ListItem, Heading, Checkbox, Button } from '@chakra-ui/react';

const Portfolio = ({ portfolio, toggleSelectStock, removeStockFromPortfolio }) => {
  return (
    <Box mt={6} p={5} borderRadius="md" borderColor="teal.500" borderWidth="2px" boxShadow="md">
      <Heading size="md" mb={3} color="teal.700">Your Portfolio</Heading>
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
              <Box>{stock.symbol}: ${stock.price}</Box>
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
