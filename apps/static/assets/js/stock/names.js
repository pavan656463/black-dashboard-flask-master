const stockNames = [
    "APOLLOHOSP.NS",
            "COALINDIA.NS",
            "SUNPHARMA.NS",
            "BPCL.NS",
            "ITC.NS",
            "BAJAJ-AUTO.NS",
            "NESTLEIND.NS",
            "BAJFINANCE.NS",
            "LTTS.NS",
            "TITAN.NS",
            "INFY.NS",
            "LTIM.NS",
            "JIOFIN.NS",
            "ADANIENT.NS",
            "GRASIM.NS",
            "JSWSTEEL.NS",
            "RELIANCE.NS",
            "KOTAKBANK.NS",
            "ADANIPORTS.NS",
            "HINDUNILVR.NS",
            "TATAMOTORS.NS",
            "DIVISLAB.NS",
            "BHARTIARTL.NS",
            "ICICIBANK.NS",
            "HDFCLIFE.NS",
            "TCS.NS",
            "BRITANNIA.NS",
            "TATACONSUM.NS",
            "UPL.NS",
            "HCLTECH.NS",
            "INDUSINDBK.NS",
            "BAJAJFINSV.NS",
            "CIPLA.NS",
            "TATASTEEL.NS",
            "HINDALCO.NS",
            "AXISBANK.NS",
            "ONGC.NS",
            "HEROMOTOCO.NS",
            "M&M.NS",
            "POWERGRID.NS",
            "ASIANPAINT.NS",
            "SBIN.NS",
            "NTPC.NS",
            "WIPRO.NS",
            "HDFCBANK.NS",
            "EICHERMOT.NS",
            "MARUTI.NS",
            "SBILIFE.NS",
            "DRREDDY.NS",
            "ULTRACEMCO.NS"
];

// Function to create a button for a stock and add it to the watchlist
function addToWatchlist(stockName) {
    const watchlist = document.getElementById("watchlist");
    const watchlistButton = document.createElement("div");
    watchlistButton.className = "watchlist-button";

    const button = document.createElement("button");
    button.textContent = stockName;
    button.className = 'download';
    button.style.border = 'none'; // Remove the button border
    button.style.backgroundColor = 'transparent'; // Set the background color to transparent
    button.style.color = 'white'; // Use the initial text color
    button.style.paddingBottom = '10px'
    button.addEventListener("click", () => chartChange(stockName));

    // Change button color to white on hover
    button.addEventListener("mouseenter", () => {
        button.style.color = 'green';
    });

    // Restore the original color when not hovered
    button.addEventListener("mouseleave", () => {
        button.style.color = 'white';
    });

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.textContent = "X";
    removeButton.style.border = 'none' ;
    removeButton.style.color = 'white' ;

    removeButton.style.backgroundColor = 'transparent' ;
    removeButton.addEventListener("click", () => removeFromWatchlist(stockName));
    // Change button color to white on hover
    removeButton.addEventListener("mouseenter", () => {
        button.style.color = 'red';
    });

    // Restore the original color when not hovered
    removeButton.addEventListener("mouseleave", () => {
        button.style.color = 'white';
    });
    watchlistButton.appendChild(button);
    watchlistButton.appendChild(removeButton);
    watchlist.appendChild(watchlistButton);
}

// Function to populate autocomplete suggestions
function populateSuggestions() {
    const stockSuggestions = document.getElementById("stockSuggestions");
    stockSuggestions.innerHTML = "";

    const searchInput = document.getElementById("inlineFormInputGroup");
    const searchString = searchInput.value.trim().toUpperCase();

    stockNames.forEach(stockName => {
        if (stockName.startsWith(searchString)) {
            const option = document.createElement("option");
            option.value = stockName;
            stockSuggestions.appendChild(option);
        }
    });
}

// Function to search for a stock and add it to the watchlist as a button
function searchStock() {
    const searchInput = document.getElementById("inlineFormInputGroup");
    const stockNameToSearch = searchInput.value.trim().toUpperCase();

    if (stockNames.includes(stockNameToSearch)) {
        // Check if the stock name exists in the stockNames array
        addToWatchlist(stockNameToSearch);
        searchInput.value = ""; // Clear the search input field
    } else {
        alert("Stock not found. Please enter a valid stock name.");
    }
}

// Function to remove a stock from the watchlist
function removeFromWatchlist(stockName) {
    const watchlist = document.getElementById("watchlist");
    const watchlistButtons = watchlist.getElementsByClassName("watchlist-button");

    for (const button of watchlistButtons) {
        const buttonText = button.querySelector("button").textContent;
        if (buttonText === stockName) {
            button.remove();
            break;
        }
    }
}

const inputElement = document.getElementById("inlineFormInputGroup");
inputElement.addEventListener("input", populateSuggestions);