import React from 'react';
import { Card, ListGroup, Button, Form, Row, Col } from 'react-bootstrap';

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
    <Card className="app-card portfolio-card">
      <Card.Body>
        <h5 className="fw-bold text-center">Portfolio</h5>
        <p className="text-center text-muted">Total Value: <strong>${portfolioValue.toFixed(2)}</strong></p>
        {portfolio.length > 0 ? (
          <ListGroup className="portfolio-list">
            {portfolio.map((stock) => (
              <ListGroup.Item key={stock.symbol} className="portfolio-item d-flex align-items-center justify-content-between">
                <Row className="w-100 align-items-center">
                  <Col xs={1} className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={selectedStocks.includes(stock.symbol)}
                      onChange={() => toggleSelectStock(stock.symbol)}
                      disabled={selectedStocks.length >= 2 && !selectedStocks.includes(stock.symbol)}
                      className="portfolio-checkbox"
                    />
                  </Col>
                  <Col xs={3} className="portfolio-symbol">
                    <strong>{stock.symbol}</strong>
                  </Col>
                  <Col xs={3} className="portfolio-price">
                    ${stock.price.toFixed(2)}
                  </Col>
                  <Col xs={3}>
                    <Form.Control
                      type="number"
                      value={stock.quantity}
                      min={1}
                      max={100}
                      onChange={(e) => handleQuantityChange(stock.symbol, Number(e.target.value))}
                      className="portfolio-quantity"
                    />
                  </Col>
                  <Col xs={2} className="text-end">
                    <Button
                      variant="danger"
                      size="sm"
                      className="portfolio-remove"
                      onClick={() => handleRemoveStock(stock.symbol)}
                    >
                      ×
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-center text-muted">No stocks in portfolio</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default Portfolio;
