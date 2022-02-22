//

const { Router }=require('express');
const { check }=require('express-validator');

const { crearUsuario,login,renewToken } = require('../controllers/auth');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router=Router();


router.post('/new',[ 
 check('nombre','En nombre es obligatorio').not().isEmpty(),
 check('email','En email es obligatorio').not().isEmpty(),
 check('email','En email es incorrecto').isEmail(),
 check('password','En password es obligatorio').not().isEmpty(),
 validarCampos
],crearUsuario);

//post:/
//validar email, password

router.post('/',[ 
    check('email','En email es obligatorio').not().isEmpty(),
    check('email','En email es incorrecto').isEmail(),
    check('password','En password es obligatorio').not().isEmpty(),
    validarCampos
],login);

//validarJWT

router.get('/renew',validarJWT,renewToken);


module.exports=router;