import React, { useState, useEffect } from "react";

// Array of symbols available for the slot
const allSymbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];

function Luckyslot() {
  const [columns, setColumns] = useState([[], [], []]); // Initial symbols for 3 columns
  const [spinning, setSpinning] = useState(false); // To track if spinning
  const [result, setResult] = useState(""); // Win or lose result
  const [payout, setPayout] = useState(0); // Payout amount
  const [betAmount, setBetAmount] = useState(0); // Bet amount

  // Function to spin the slot machine
  const spinSlot = () => {
    // Start spinning animation by randomizing symbols for 2 seconds
    const spinInterval = setInterval(() => {
      setColumns([
        [randomSymbol(), randomSymbol(), randomSymbol()],
        [randomSymbol(), randomSymbol(), randomSymbol()],
        [randomSymbol(), randomSymbol(), randomSymbol()],
      ]);
    }, 100); // Change symbols every 100ms for the spinning effect

    setSpinning(true);

    // Stop spinning after 2 seconds and get backend result
    setTimeout(async () => {
      clearInterval(spinInterval); // Stop the randomization

      // Fetch the backend result symbols
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/playslot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ betAmount }), // Send bet amount to backend
        });

        const data = await response.json();
        setColumns((prevColumns) => [
          [prevColumns[0][0], data.symbols[0], prevColumns[0][2]], // Keep top row, randomize middle row symbol
          [prevColumns[1][0], data.symbols[1], prevColumns[1][2]], // Middle row set to backend result symbols
          [prevColumns[2][0], data.symbols[2], prevColumns[2][2]], // Keep bottom row, randomize middle row symbol
        ]);
        setResult(data.result); // win or lose
        setPayout(data.payout); // payout if win
      } catch (error) {
        console.error("Error fetching slot result:", error);
      }

      setSpinning(false); // Reset spinning state
    }, 2000); // Stop spinning after 2 seconds
  };

  // Helper function to get a random symbol
  const randomSymbol = () =>
    allSymbols[Math.floor(Math.random() * allSymbols.length)];
  console.log(columns)
  return (
    <div>
      <h1>Lucky Slot Game</h1>

      <div>
        <label>
          Bet Amount:
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />
        </label>
        <button onClick={spinSlot} disabled={spinning}>
          {spinning ? "Spinning..." : "Spin"}
        </button>
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        {/* Displaying 3 columns with symbols */}
        {columns.map((column, colIndex) => (
          <div key={colIndex} style={{ margin: "0 10px", fontSize: "2rem" }}>
            {column.map((symbol, rowIndex) => (
              <div key={rowIndex} style={{ margin: "10px" }}>
                {symbol}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Display result and payout */}
      {result && (
        <div>
          <h3>
            {result === "win" ? `You win! Payout: $${payout}` : "You lose!"}
          </h3>
        </div>
      )}
    </div>
  );
}

export default Luckyslot;
