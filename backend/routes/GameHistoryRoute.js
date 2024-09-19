const express = require('express');
const { insertgamehistory, updategamehistory, getAllgamehistory, getSinglegamehistory, deletegamehistory } = require("../controllers/GameHistoryController");
const router = express.Router();

router.post('/insertgamehistory', insertgamehistory);
router.put('/updategamehistory', updategamehistory,);
router.get('/getAllgamehistory', getAllgamehistory);
router.post('/getSinglegamehistory', getSinglegamehistory);
router.delete('/deletegamehistory', deletegamehistory);

module.exports = router;