const {insertuser,updateuser,userlogin,getAlluser,deleteuser,getSingleuser,userlogout} = require('../controllers/UserController');
const express = require('express');
const router = express.Router();

router.post('/insertuser',insertuser);
router.put('/updateuser',updateuser,);
router.post('/userlogin',userlogin);
router.get('/getAlluser',getAlluser);
router.post('/getSingleuser',getSingleuser);
router.delete('/deleteuser',deleteuser);
router.post('/userlogout',userlogout);




module.exports=router;
