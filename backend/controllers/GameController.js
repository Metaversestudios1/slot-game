const Game = require("../models/Game");

const symbols = ['🍒', '🍋', '🔔', '💎', '7️⃣'];

// Function to generate random symbols
function spinSlot() {
    const winProbability = 0.3; // 30% chance to win
    const isWin = Math.random() <= winProbability; // Determine if it is a winning spin
  
    if (isWin) {
      // Generate matching symbols for a win
      const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      return [winningSymbol, winningSymbol, winningSymbol];
    } else {
      // Generate random non-matching symbols for a loss
      return [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
    }
  }
  
// Calculate payout based on bet amount
function calculatePayout(betAmount) {
  return betAmount * 1.8;  // Example multiplier for a win (can adjust based on the game)
}

const gameInfo = async (req, res) => {
  res.status(200).json({ message: "this is game route" });
};

  
const checkWinOrLose = async (req, res) => {
    const { betAmount } = req.body;
  
    try {
      const resultSymbols = spinSlot();
  
      const isWin = resultSymbols.every((symbol) => symbol === resultSymbols[0]);

      let payout = 0;
      let result = "lose";
  
      if (isWin) {
        result = "win";
        payout = calculatePayout(betAmount);
      }
  
      // Save game result to database
      const game = new Game({
        betAmount,
        payout,
        result,
        symbols: resultSymbols,
      });
  
      await game.save();
      console.log(resultSymbols)
      return res.json({
        result,
        payout,
        symbols: resultSymbols,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error });
    }
  };
  
module.exports = {
  gameInfo,
  checkWinOrLose,
};
