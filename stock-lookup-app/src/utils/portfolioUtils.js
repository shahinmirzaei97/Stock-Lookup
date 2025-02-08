// src/utils/portfolioUtils.js

// Function to add stock to portfolio
export const addStockToPortfolio = async (symbol, setPortfolio) => {
    try {
        const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${process.env.REACT_APP_FMP_API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch stock price');

        const data = await response.json();

        if (data.length > 0 && data[0].price !== undefined) {
            const stockToAdd = {
                symbol: data[0].symbol,
                price: parseFloat(data[0].price), // Ensure price is correctly stored
                quantity: 1, // Default quantity
            };

            setPortfolio((prevPortfolio) => {
                const existingStock = prevPortfolio.find(stock => stock.symbol === stockToAdd.symbol);
                if (!existingStock) {
                    return [...prevPortfolio, stockToAdd];
                }
                return prevPortfolio;
            });
        } else {
            throw new Error('Stock data is incomplete');
        }
    } catch (error) {
        console.error('Error adding stock to portfolio:', error.message);
    }
};

// Function to remove stock from portfolio
export const removeStockFromPortfolio = (symbol, setPortfolio) => {
    setPortfolio((prevPortfolio) => 
        prevPortfolio.filter(stock => stock.symbol !== symbol)
    );
};
