const express =require('express');
const {insertadmin,login,logout}=require("../controllers/AdminController");
const router = express.Router();

router.post('/insertadmin',insertadmin);
router.post('/login',login);
router.post('/logout',logout);
module.exports = router;