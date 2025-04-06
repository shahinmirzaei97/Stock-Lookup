// src/components/StockDetails.js
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Row, Col, Button } from 'react-bootstrap';
import StockGraph from './StockGraph';
import { addStockToPortfolio, removeStockFromPortfolio } from '../utils/portfolioUtils';

const StockDetails = ({ selectedStock, setPortfolio, portfolio }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedStock) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://financialmodelingprep.com/api/v3/profile/${selectedStock}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
        const data = await res.json();
        setDetails(data[0]);
      } catch (err) {
        setError("Failed to load stock details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [selectedStock]);

  if (loading) return <Spinner animation="border" variant="primary" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!details) return null;

  const isInPortfolio = portfolio.some(stock => stock.symbol === details.symbol);

  return (
    <Card className="app-card">
      <Card.Body>
        <h5 className="text-center fw-bold mb-3">{details.companyName}</h5>

        <Row className="mb-2">
          <Col xs={6}><strong>Symbol:</strong> {details.symbol}</Col>
          <Col xs={6}><strong>Price:</strong> ${details.price}</Col>
        </Row>

        <Row className="mb-2">
          <Col xs={6}><strong>Industry:</strong> {details.industry}</Col>
          <Col xs={6}><strong>Sector:</strong> {details.sector}</Col>
        </Row>

        <Row className="mb-3">
          <Col><strong>CEO:</strong> {details.ceo}</Col>
        </Row>

        {isInPortfolio ? (
          <Button variant="danger" onClick={() => removeStockFromPortfolio(details.symbol, setPortfolio)}>
            Remove from Portfolio
          </Button>
        ) : (
          <Button variant="success" onClick={() => addStockToPortfolio(details.symbol, setPortfolio)}>
            Add to Portfolio
          </Button>
        )}

        <div className="mt-4">
          <StockGraph symbols={[details.symbol]} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default StockDetails;