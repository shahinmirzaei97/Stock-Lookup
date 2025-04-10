import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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

  const fetchSuggestions = useCallback((query) => {
    debouncedFetch(query);
  }, [debouncedFetch]);

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

  const searchRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Card className="app-card card-details mx-3" ref={searchRef}>
      <Card.Body>
        <h5 className="section-title text-center mb-3">Search for a stock</h5>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={symbol}
            onChange={handleInputChange}
            placeholder="Search for a stock... (AAPL, META)"
            className="app-input"
          />
        </Form.Group>
        {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {suggestions.length > 0 && (
          <ListGroup>
            {suggestions.map((s) => (
              <ListGroup.Item key={s.symbol} className="app-list-item d-flex justify-content-between align-items-center">
                <span onClick={() => handleViewDetails(s.symbol)}>{s.symbol} - {s.name}</span>
                <div>
                  <Button variant="success" size="sm" className="me-2" onClick={() => handleAddToPortfolio(s.symbol)}>+</Button>
                  <Button variant="primary" size="sm" className="app-button" onClick={() => handleViewDetails(s.symbol)}>View</Button>
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
