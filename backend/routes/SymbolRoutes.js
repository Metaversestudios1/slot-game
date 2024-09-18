const {    insertsymbol,
    updatesymbol,
    getAllsymbol,
    getSinglesymbol,
    deletesymbol,} = require('../controllers/SymbolController');
const express = require('express');
const router = express.Router();

router.post('/insertsymbol',insertsymbol);
router.put('/updatesymbol',updatesymbol,);
router.get('/getAllsymbol',getAllsymbol);
router.get('/getSinglesymbol',getSinglesymbol);
router.delete('/deletesymbol',deletesymbol);

module.exports=router;
