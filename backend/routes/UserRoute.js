const {insertuser,updateuser,userlogin,getAlluser,deleteuser,getSingleuser,userlogout,verifyOtp,sendotp,resetPassword} = require('../controllers/UserController');
const express = require('express');
const router = express.Router();

router.post('/insertuser',insertuser);
router.put('/updateuser',updateuser,);
router.post('/userlogin',userlogin);
router.get('/getAlluser',getAlluser);
router.post('/getSingleuser',getSingleuser);
router.delete('/deleteuser',deleteuser);
router.post('/userlogout',userlogout);
router.post('/sendotp', sendotp);
router.post('/verifyOtp', verifyOtp);
router.post('/resetPassword', resetPassword);




module.exports=router;
