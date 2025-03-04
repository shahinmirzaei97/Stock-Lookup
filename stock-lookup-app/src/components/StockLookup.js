import React, { useState, useCallback, useMemo } from 'react';
import { Form, Card, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { debounce } from '../utils/debounce';
import { addStockToPortfolio } from '../utils/portfolioUtils';

const StockLookup = ({ setPortfolio, setSelectedStock }) => {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (query) => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `https://financialmodelingprep.com/api/v3/search?query=${query}&limit=10&apikey=${process.env.REACT_APP_FMP_API_KEY}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch suggestions");
          }
          const data = await response.json();
          setSuggestions(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }, 500),
    [setLoading, setError, setSuggestions]
  );

  const fetchSuggestions = useCallback(
    (query) => {
      debouncedFetch(query);
    },
    [debouncedFetch]
  );

  const handleInputChange = (event) => {
    const input = event.target.value.toUpperCase();
    setSymbol(input);
    if (input.length >= 2) {
      fetchSuggestions(input);
    } else {
      setSuggestions([]);
    }
  };

  const handleViewDetails = (symbol) => {
    setSelectedStock(symbol);
    setSuggestions([]);
    setSymbol('');
  };

  const handleAddToPortfolio = (symbol) => {
    addStockToPortfolio(symbol, setPortfolio);
  };

  return (
    <Card className="shadow-sm" style={{ backgroundColor: "#3A3A3A", color: "#FFFFFF", border: "none" }}>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={symbol}
            onChange={handleInputChange}
            placeholder="Search for a stock..."
            style={{ backgroundColor: "#4A4A4A", color: "#FFFFFF", border: "1px solid #0074E4" }}
          />
        </Form.Group>

        {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {suggestions.length > 0 && (
          <ListGroup>
            {suggestions.map((s) => (
              <ListGroup.Item key={s.symbol} className="d-flex justify-content-between align-items-center" style={{ backgroundColor: "#2A2A2A", color: "#FFFFFF", borderBottom: "1px solid #0074E4" }}>
                <span onClick={() => handleViewDetails(s.symbol)}>{s.symbol} - {s.name}</span>
                <div>
                  <Button variant="success" size="sm" className="me-2" onClick={() => handleAddToPortfolio(s.symbol)}>+</Button>
                  <Button variant="primary" size="sm" onClick={() => handleViewDetails(s.symbol)}>View</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default StockLookup;
