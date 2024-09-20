const Game = require("../models/Game");
const Symbol = require("../models/Symbols");
 
// const symbols = ['🍒', '🍋', '🔔', '💎', "7️⃣"];
 
// Function to generate random symbols
async function spinSlot() {
    const symbols = await Symbol.find({deleted_at:null}).exec(); // Adjust this based on your model
    let winProbability = 0; // 30% chance to win
 
    if(symbols.length >0){
      winProbability = parseInt(symbols.win_percentage);
    }
    console.log(winProbability)
    const isWin = Math.random() <= winProbability; // Determine if it is a winning spin  
 
    if (isWin) {
      // Generate matching symbols for a win
      const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)].symbol_name;
      return [winningSymbol, winningSymbol, winningSymbol];
    } else {
      // Generate random non-matching symbols for a loss
      return [
        symbols[Math.floor(Math.random() * symbols.length)].symbol_name,
        symbols[Math.floor(Math.random() * symbols.length)].symbol_name,
        symbols[Math.floor(Math.random() * symbols.length)].symbol_name,
      ];
    }
  }
 
// Calculate payout based on bet amount
function calculatePayout(betAmount,win_amount) {
  return betAmount * win_amount;  // Example multiplier for a win (can adjust based on the game)
}
 
const gameInfo = async (req, res) => {
  res.status(200).json({ message: "this is game route" });
};
 
  const getwinamount = async(symbol) =>{
    const result = await Symbol.findOne({symbol_name:symbol});
    console.log(result);
    return result.win_amount;
  }
const checkWinOrLose = async (req, res) => {
    const { betAmount } = req.body;
 
    try {
      const resultSymbols = await spinSlot();
 
      const isWin = resultSymbols.every((symbol) => symbol === resultSymbols[0]);
// console.log(resultSymbols[0]);
 
      let payout = 0;
      let result = "lose";
 
      if (isWin) {
        const win_amount = await getwinamount(resultSymbols[0]);
        console.log(win_amount);
        result = "win";
        payout = calculatePayout(betAmount,win_amount);
      }
 
      // Save game result to database
      const game = new Game({
        betAmount,
        payout,
        result,
        symbols: resultSymbols,
      });
 
      await game.save();
      // console.log(resultSymbols)
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