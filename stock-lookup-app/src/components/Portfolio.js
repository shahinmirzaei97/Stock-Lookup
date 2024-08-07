// src/components/Portfolio.js
import React from 'react';
import { Box, List, ListItem, Heading, Checkbox, Button } from '@chakra-ui/react';

const Portfolio = ({ portfolio, toggleSelectStock, removeStockFromPortfolio }) => {
  return (
    <Box mt={6}>
      <Heading size="md" mb={3}>Portfolio</Heading>
      <List spacing={3}>
        {portfolio.map((stock) => (
          <ListItem key={stock.symbol} display="flex" alignItems="center">
            <Checkbox
              isChecked={stock.selected}
              onChange={() => toggleSelectStock(stock.symbol)}
              isDisabled={!stock.selected && portfolio.filter(s => s.selected).length >= 2}
              mr={3}
            />
            {stock.symbol}: ${stock.price}
            <Button onClick={() => removeStockFromPortfolio(stock.symbol)} colorScheme="red" size="sm" ml={3}>
              Remove
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Portfolio;
