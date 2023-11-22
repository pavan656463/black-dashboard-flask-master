var canvas = document.getElementById("symbolCanvas");
var context = canvas.getContext("2d");

// Function to draw the symbol on the canvas
function drawSymbol(symbol) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText(symbol, 10, 30);
}

// Initialize the canvas with an initial symbol
var currentSymbol = "AAPL"; // Initial symbol
drawSymbol(currentSymbol);

// Add an event listener to the button to change the symbol
document.getElementById("changeSymbolButton").addEventListener("click", function () {
    // You can prompt the user for input or use any method to get the new symbol
    var newSymbol = prompt("Enter a new symbol:");

    if (newSymbol) {
        currentSymbol = newSymbol;
        drawSymbol(currentSymbol);

        // Update the TradingView widget with the new symbol
        updateTradingViewWidget(currentSymbol);
    }
});

// Function to update the TradingView widget with a new symbol
function updateTradingViewWidget(newSymbol) {
    // Remove the existing widget
    var widgetContainer = document.getElementById("tradingview_2d863");
    widgetContainer.innerHTML = "";

    // Create a new TradingView widget with the updated symbol
    new TradingView.widget({
        "width": 980,
        "height": 610,
        "symbol": newSymbol,
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "in",
        "enable_publishing": false,
        "range": "YTD",
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "details": true,
        "container_id": "tradingview_2d863"
    });
}
