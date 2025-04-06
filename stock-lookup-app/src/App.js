import React, { useState } from "react";
import StockLookup from "./components/StockLookup";
import StockComparison from "./components/StockComparison";
import Portfolio from "./components/Portfolio";
import StockDetails from "./components/StockDetails";
import { Container, Navbar, Row, Col, Card, Button, Collapse } from "react-bootstrap";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const App = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showPortfolio, setShowPortfolio] = useState(true);

  // Function to fetch stock price before adding to portfolio
  const fetchStockPrice = async (symbol) => {
    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${process.env.REACT_APP_FMP_API_KEY}`
      );
      if (!response.ok) throw new Error("Failed to fetch stock price");

      const data = await response.json();
      if (data.length > 0 && data[0].price !== undefined) {
        return parseFloat(data[0].price);
      }
    } catch (error) {
      console.error("Error fetching stock price:", error.message);
    }
    return 0;
  };

  const onAddToPortfolio = async (symbol) => {
    const price = await fetchStockPrice(symbol);
    setPortfolio((prevPortfolio) => {
      if (!prevPortfolio.some((stock) => stock.symbol === symbol)) {
        return [...prevPortfolio, { symbol, price, quantity: 1 }];
      }
      return prevPortfolio;
    });
  };

  const onRemoveFromPortfolio = (symbol) => {
    setPortfolio((prevPortfolio) =>
      prevPortfolio.filter((stock) => stock.symbol !== symbol)
    );
    setSelectedStocks((prevSelected) =>
      prevSelected.filter((s) => s !== symbol)
    );
  };

  const toggleSelectStock = (symbol) => {
    setSelectedStocks((prevSelected) => {
      if (prevSelected.includes(symbol)) {
        return prevSelected.filter((s) => s !== symbol);
      }
      if (prevSelected.length < 2) {
        return [...prevSelected, symbol];
      }
      return prevSelected;
    });
  };

  return (
    <Container fluid className="app-container">
      <Navbar className="app-navbar">
        <Navbar.Brand className="app-title">Stock Lookup</Navbar.Brand>
      </Navbar>
      <Row className="mb-4">
        <Col md={12}>
          <StockLookup setPortfolio={setPortfolio} setSelectedStock={setSelectedStock} />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Card className="app-card">
            <Card.Header className="app-card-header">
              <span>Portfolio ({portfolio.length})</span>
              <Button 
                variant="link" 
                className="p-0 border-0" 
                onClick={() => setShowPortfolio(!showPortfolio)}
                aria-controls="portfolio-collapse" 
                aria-expanded={showPortfolio}
              >
                {showPortfolio ? <BsChevronUp size={18} /> : <BsChevronDown size={18} />}
              </Button>
            </Card.Header>
            <Collapse in={showPortfolio}>
              <div id="portfolio-collapse">
                <Card.Body>
                  <Portfolio 
                    portfolio={portfolio} 
                    setPortfolio={setPortfolio} 
                    toggleSelectStock={toggleSelectStock} 
                    selectedStocks={selectedStocks}
                    setSelectedStock={setSelectedStock}
                  />
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="app-card">
            {selectedStock ? (
              <StockDetails
                selectedStock={selectedStock}
                setPortfolio={setPortfolio}
                portfolio={portfolio}
                isInPortfolio={portfolio.some(
                  (stock) => stock.symbol === selectedStock
                )}
                onAddToPortfolio={onAddToPortfolio}
                onRemoveFromPortfolio={onRemoveFromPortfolio}
              />
            ) : (
              <p className="text-center text-muted">Select a stock to view details</p>
            )}
          </Card>
        </Col>
        <Col md={3}>
          <Card className="app-card">
            <StockComparison selectedStocks={selectedStocks} setSelectedStocks={setSelectedStocks} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
