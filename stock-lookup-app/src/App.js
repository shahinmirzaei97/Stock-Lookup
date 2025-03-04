import React, { useState } from "react";
import StockLookup from "./components/StockLookup";
import StockComparison from "./components/StockComparison";
import Portfolio from "./components/Portfolio";
import StockDetails from "./components/StockDetails";
import { Container, Navbar, Row, Col, Card, Button, Collapse } from "react-bootstrap";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const ACCENT_COLOR = "#0074E4"; // Deep Blue Accent
const BACKGROUND_COLOR = "#2A2A2A"; // Lighter Grey for better contrast
const CARD_BACKGROUND = "#3A3A3A"; // Slightly lighter grey for cards
const TEXT_COLOR = "#FFFFFF";

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
    <Container fluid style={{ backgroundColor: BACKGROUND_COLOR, minHeight: "100vh", color: TEXT_COLOR }}>
      <Navbar style={{ backgroundColor: BACKGROUND_COLOR }} variant="dark" className="mb-4 px-4 justify-content-center">
        <Navbar.Brand style={{ color: TEXT_COLOR, fontSize: "1.5rem" }}>Stock Lookup</Navbar.Brand>
      </Navbar>
      <Row className="mb-4">
        <Col md={12}>
          <StockLookup setPortfolio={setPortfolio} setSelectedStock={setSelectedStock} />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Card className="p-3 shadow-sm" style={{ backgroundColor: CARD_BACKGROUND, color: TEXT_COLOR }}>
            <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: ACCENT_COLOR, color: "#FFFFFF" }}>
              <span>Portfolio ({portfolio.length})</span>
              <Button 
                variant="link" 
                className="p-0 border-0" 
                onClick={() => setShowPortfolio(!showPortfolio)}
                aria-controls="portfolio-collapse" 
                aria-expanded={showPortfolio}
                style={{ color: "#FFFFFF" }}
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
                  />
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3 shadow-sm" style={{ backgroundColor: CARD_BACKGROUND, color: TEXT_COLOR }}>
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
          <Card className="p-3 shadow-sm" style={{ backgroundColor: CARD_BACKGROUND, color: TEXT_COLOR }}>
            <StockComparison selectedStocks={selectedStocks} setSelectedStocks={setSelectedStocks} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
