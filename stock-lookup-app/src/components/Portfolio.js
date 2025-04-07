import React from 'react';
import { Card, ListGroup, Button, Form } from 'react-bootstrap';

const Portfolio = ({ portfolio, setPortfolio, toggleSelectStock, selectedStocks, setSelectedStock }) => {
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
    <Card className="app-card card-portfolio">
      <Card.Body>
        <h5 className="text-center section-title">Portfolio</h5>
        <p className="text-center text-muted">Total Value: <strong>${portfolioValue.toFixed(2)}</strong></p>
        {portfolio.length > 0 ? (
          <ListGroup className="portfolio-list">
            {portfolio.map((stock) => (
              <ListGroup.Item key={stock.symbol} className="portfolio-item">
                <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      checked={selectedStocks.includes(stock.symbol)}
                      onChange={() => toggleSelectStock(stock.symbol)}
                      disabled={selectedStocks.length >= 2 && !selectedStocks.includes(stock.symbol)}
                      className="me-2"
                    />
                    <strong>{stock.symbol}</strong>
                  </div>
                  <div>${stock.price.toFixed(2)}</div>
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <Form.Control
                    type="number"
                    value={stock.quantity}
                    min={1}
                    max={100}
                    onChange={(e) => handleQuantityChange(stock.symbol, Number(e.target.value))}
                    className="w-auto"
                    style={{ minWidth: "80px" }}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedStock(stock.symbol)}
                  >
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveStock(stock.symbol)}
                  >
                    ×
                  </Button>
                </div>
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
