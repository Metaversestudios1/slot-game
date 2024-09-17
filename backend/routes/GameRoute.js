const express = require("express");
const router = express.Router();
const { gameInfo, checkWinOrLose } = require("../controllers/GameController");
router.get("/gameInfo", gameInfo);
router.post('/playslot',checkWinOrLose)
module.exports = router;
