const Game = require("../models/Game");
const Symbol = require("../models/Symbols");

async function spinSlot(betAmount) {
  const symbols = await Symbol.find({ deleted_at: null }).exec();

  const weightedSymbols = [];
  symbols.forEach((symbol) => {
    const weightCount = Math.round(symbol.win_percentage * 100);
    for (let i = 0; i < weightCount; i++) {
      weightedSymbols.push(symbol.symbol_name);
    }
  });
  let winProbability;
  if (betAmount === 1) {
    winProbability = 0.9;
  } else if (betAmount >= 2 && betAmount <= 5) {
    winProbability = 0.4;
  } else {
    winProbability = 0.2;
  }
  const isWin = Math.random() <= winProbability;
  console.log(isWin)
  if (isWin) {
    const winningSymbol =
      weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
    return [winningSymbol, winningSymbol, winningSymbol];
  } else {
    return [
      weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)],
      weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)],
      weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)],
    ];
  }
}

function calculatePayout(betAmount, win_amount) {
  if (!win_amount) return 0;
  return betAmount * win_amount;
}

const getWinAmount = async (symbol) => {
  const result = await Symbol.findOne({
    symbol_name: symbol,
    deleted_at: null,
  });
  return result.win_amount;
};

const checkWinOrLose = async (req, res) => {
  const { betAmount } = req.body;

  try {
    const resultSymbols = await spinSlot(betAmount);
    const isWin = resultSymbols.every((symbol) => symbol === resultSymbols[0]);

    let payout = 0;
    let result = "lose";

    if (isWin) {
      const win_amount = await getWinAmount(resultSymbols[0]);
      result = "win";
      payout = calculatePayout(betAmount, win_amount);
    }

    // Save game result to database
    const game = new Game({
      betAmount,
      payout,
      result,
      symbols: resultSymbols,
    });

    await game.save();

    return res.json({
      result,
      payout,
      symbols: resultSymbols,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
const gameInfo = async (req, res) => {
  res.status(200).json({ message: "this is game route" });
};
module.exports = {
  gameInfo,
  checkWinOrLose,
};
