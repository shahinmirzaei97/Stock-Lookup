// src/components/StockDetails.js
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import StockGraph from './StockGraph';
import { addStockToPortfolio, removeStockFromPortfolio } from '../utils/portfolioUtils';

const StockDetails = ({ selectedStock, setPortfolio, isInPortfolio }) => {
  const [stockDetails, setStockDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch detailed stock information
        const detailsResponse = await fetch(`https://financialmodelingprep.com/api/v3/profile/${selectedStock}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
        if (!detailsResponse.ok) throw new Error('Network response was not ok');
        const detailsData = await detailsResponse.json();

        setStockDetails(detailsData[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [selectedStock]);

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white text-center">
        Stock Details
      </Card.Header>
      <Card.Body>
        {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {stockDetails && (
          <>
            <Card.Title>{stockDetails.companyName}</Card.Title>
            <Card.Text><strong>Symbol:</strong> {stockDetails.symbol}</Card.Text>
            <Card.Text><strong>Price:</strong> ${stockDetails.price}</Card.Text>
            <Card.Text><strong>Industry:</strong> {stockDetails.industry}</Card.Text>
            <Card.Text><strong>Sector:</strong> {stockDetails.sector}</Card.Text>
            <Card.Text><strong>CEO:</strong> {stockDetails.ceo}</Card.Text>
            <Card.Text><strong>Description:</strong> {stockDetails.description}</Card.Text>

            <StockGraph symbols={[selectedStock]} />

            <Button
              variant={isInPortfolio ? "danger" : "primary"}
              className="mt-3"
              onClick={() => isInPortfolio
                ? removeStockFromPortfolio(selectedStock, setPortfolio)
                : addStockToPortfolio(selectedStock, setPortfolio)}
            >
              {isInPortfolio ? 'Remove from Portfolio' : 'Add to Portfolio'}
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default StockDetails;
