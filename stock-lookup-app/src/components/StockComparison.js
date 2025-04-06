import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Row, Col, Button } from 'react-bootstrap';
import StockGraph from './StockGraph';

const StockComparison = ({ selectedStocks, setSelectedStock }) => {
  const [stockDetails, setStockDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const detailsPromises = selectedStocks.map(stock =>
          fetch(`https://financialmodelingprep.com/api/v3/profile/${stock}?apikey=${process.env.REACT_APP_FMP_API_KEY}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => (data.length > 0 ? data[0] : null))
        );

        const details = await Promise.all(detailsPromises);
        const validDetails = details.filter(detail => detail !== null);
        setStockDetails(validDetails);
      } catch (error) {
        setError('Error fetching stock details for comparison. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedStocks.length === 2) {
      fetchStockDetails();
    } else {
      setStockDetails([]);
    }
  }, [selectedStocks]);

  return (
    <Card className="shadow-sm" >
      <Card.Body>
        {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {selectedStocks.length === 2 && stockDetails.length === 2 ? (
          <>
            <Row className="mb-3">
              {stockDetails.map(stock => (
                <Col key={stock.symbol} md={6}>
                  <Card className="p-3" >
                    <Card.Title>{stock.companyName}</Card.Title>
                    <Card.Text><strong>Symbol:</strong> {stock.symbol}</Card.Text>
                    <Card.Text><strong>Price:</strong> ${stock.price}</Card.Text>
                    <Card.Text><strong>Industry:</strong> {stock.industry}</Card.Text>
                    <Card.Text><strong>Sector:</strong> {stock.sector}</Card.Text>
                    <Card.Text><strong>CEO:</strong> {stock.ceo}</Card.Text>
                    <Button variant="primary" style={{ backgroundColor: "#0074E4", border: "none" }} onClick={() => setSelectedStock(stock.symbol)}>
                      View Stock Details
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
            <StockGraph symbols={selectedStocks} />
          </>
        ) : (
          <p className="text-center text-muted">Select two stocks to compare.</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default StockComparison;