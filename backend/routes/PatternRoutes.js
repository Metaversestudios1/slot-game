const { insertpattern,
    updatepattern,
    getAllpattern,
    getSinglepattern,
    deletepattern,} = require('../controllers/PatternController');
const express = require('express');
const router = express.Router();

router.post('/insertpattern',insertpattern);
router.put('/updatepattern',updatepattern,);
router.get('/getAllpattern',getAllpattern);
router.post('/getSinglepattern',getSinglepattern);
router.delete('/deletepattern',deletepattern);

module.exports=router;
