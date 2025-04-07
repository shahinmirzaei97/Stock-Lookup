import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Row, Col, Button, Collapse } from 'react-bootstrap';
import StockGraph from './StockGraph';
import { addStockToPortfolio, removeStockFromPortfolio } from '../utils/portfolioUtils';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

const StockDetails = ({ selectedStock, setPortfolio, portfolio }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

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
    <Card className="app-card card-details">
      <Card.Body>
        <h5 className="text-center section-title">{details.companyName}</h5>

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

        {details.description && (
          <div className="mt-3">
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>{details.description}</p>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
          <h6 className="mb-0">Price History</h6>
          <Button
            variant="link"
            onClick={() => setShowGraph(!showGraph)}
            aria-controls="graph-collapse"
            aria-expanded={showGraph}
            className="p-0"
            style={{ color: '#0056b3' }}
          >
            {showGraph ? <BsChevronUp /> : <BsChevronDown />}
          </Button>
        </div>

        <Collapse in={showGraph}>
          <div id="graph-collapse">
            <StockGraph symbols={[details.symbol]} />
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default StockDetails;
