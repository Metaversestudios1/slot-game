const Game = require("../models/Game");
const Symbol = require("../models/Symbols");
const Pattern = require("../models/Pattern");

async function spinSlot(betAmount) {
  const symbols = await Symbol.find({ deleted_at: null }).exec();

  const weightedSymbols = [];
  symbols.forEach((symbol) => {
    const weightCount = Math.round(symbol.win_percentage * 100);
    for (let i = 0; i < weightCount; i++) {
      weightedSymbols.push(symbol.symbol_name);
    }
  });

  const matrix = [];
  for (let row = 0; row < 3; row++) {
    matrix[row] = [];
    for (let col = 0; col < 3; col++) {
      matrix[row][col] =
        weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
    }
  }

  return matrix; // Return the 3x3 matrix of symbols
}

function calculatePayout(betAmount, winAmount) {
  if (!winAmount) return 0;
  return betAmount * winAmount;
}

const checkMatrixAgainstPatterns = async (matrix) => {
  const patterns = await Pattern.find().exec(); // Fetch all patterns from the DB
  let totalWinAmount = 0;
  let count = 1;
  let winningCoordinates = []; // Track coordinates of winning symbols

  for (const pattern of patterns) {
    let currentPatternWinAmount = 0; // Track win amount for the current pattern
    let currentPatternCoordinates = []; // Temporary storage for current pattern's coordinates

    // Check all symbol IDs in the pattern
    for (const symbolId of pattern.symbol) {
      const symbolDoc = await Symbol.findById(symbolId); // Fetch the actual symbol from the symbol ID
      const actualSymbol = symbolDoc.symbol_name; // Get the actual symbol, e.g., "🍊"

      const patternCoordinates = pattern.coordinates.get(symbolId); // Use `.get()` to access the value in Map

      // Ensure that patternCoordinates is an array and exists
      if (!Array.isArray(patternCoordinates)) {
        console.error(
          `Pattern coordinates not found or not an array for symbol ID: ${symbolId}`
        );
        continue; // Skip this pattern if coordinates are invalid
      }

      // Check if the matrix matches the pattern using actual symbols
      let match = true;
      for (const [row, col] of patternCoordinates) {
        if (matrix[row - 1][col - 1] !== actualSymbol) {
          match = false;
          break;
        }
      }

      // If the symbol matches its coordinates, accumulate win amount
      if (match && count < 4) {
        count++;
        currentPatternWinAmount += pattern.win_amount;
        currentPatternCoordinates.push(...patternCoordinates); // Store the matching coordinates
      }
    }

    // Add current pattern's win amount to total if any matches are found
    if (currentPatternWinAmount > 0) {
      totalWinAmount += currentPatternWinAmount;
      winningCoordinates.push(...currentPatternCoordinates); // Store winning coordinates for this pattern
    }
  }

  if (totalWinAmount > 0) {
    return { isWin: true, totalWinAmount, winningCoordinates }; // Return win amount and coordinates if there are any matches
  }

  return { isWin: false, winningCoordinates: [] }; // No matching pattern, return lose and empty coordinates
};

const checkWinOrLose = async (req, res) => {
  const { betAmount } = req.body;

  try {
    const matrix = await spinSlot(betAmount); // Generate the 3x3 matrix
    const { isWin, totalWinAmount, winningCoordinates } =
      await checkMatrixAgainstPatterns(matrix); // Check if matrix matches any pattern

    let payout = 0;
    let result = "lose";

    if (isWin) {
      result = "win";
      payout = calculatePayout(betAmount, totalWinAmount); // Calculate payout based on total win amount
    }

    // Save game result to the database
    const game = new Game({
      betAmount,
      payout,
      result,
      symbols: matrix.flat(), // Store the flat matrix as the symbols
    });

    await game.save();

    return res.json({
      success: true,
      result,
      payout,
      symbols: matrix, // Return the full 2D matrix
      winningCoordinates, // Return the winning coordinates to highlight the combo
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
