import React from 'react';
import { Card, ListGroup, Button, Form } from 'react-bootstrap';

const Portfolio = ({ portfolio, setPortfolio, toggleSelectStock, selectedStocks }) => {
  const portfolioValue = portfolio.reduce(
    (sum, stock) => sum + stock.price * stock.quantity,
    0
  );

  const handleQuantityChange = (symbol, quantity) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.map((stock) =>
        stock.symbol === symbol ? { ...stock, quantity } : stock
      )
    );
  };

  const handleRemoveStock = (symbol) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.filter((stock) => stock.symbol !== symbol)
    );
  };

  return (
    <Card className="shadow-sm" style={{ backgroundColor: "#3A3A3A", color: "#FFFFFF", border: "none" }}>
      <Card.Body>
        <p className="fw-bold">Total Value: ${portfolioValue.toFixed(2)}</p>
        <ListGroup>
          {portfolio.map((stock) => (
            <ListGroup.Item key={stock.symbol} className="d-flex justify-content-between align-items-center" style={{ backgroundColor: "#2A2A2A", color: "#FFFFFF", borderBottom: "1px solid #0074E4" }}>
              <div>
                <Form.Check
                  type="checkbox"
                  checked={selectedStocks.includes(stock.symbol)}
                  onChange={() => toggleSelectStock(stock.symbol)}
                  disabled={selectedStocks.length >= 2 && !selectedStocks.includes(stock.symbol)}
                  className="me-2"
                />
                {stock.symbol}: ${stock.price.toFixed(2)}
              </div>
              <Form.Control
                type="number"
                value={stock.quantity}
                min={1}
                max={100}
                onChange={(e) => handleQuantityChange(stock.symbol, Number(e.target.value))}
                style={{ width: '60px', display: 'inline-block', backgroundColor: "#4A4A4A", color: "#FFFFFF", border: "1px solid #0074E4" }}
              />
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveStock(stock.symbol)}
              >
                Remove
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Portfolio;