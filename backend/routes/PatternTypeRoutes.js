const {    insertpatterntype,
    updatepatterntype,
    getAllpatterntype,
    getSinglepatterntype,
    deletepatterntype} = require('../controllers/PatternTypeController');
const express = require('express');
const router = express.Router();

router.post('/insertpatterntype',insertpatterntype);
router.put('/updatepatterntype',updatepatterntype,);
router.get('/getAllpatterntype',getAllpatterntype);
router.post('/getSinglepatterntype',getSinglepatterntype);
router.delete('/deletepatterntype',deletepatterntype);

module.exports=router;
