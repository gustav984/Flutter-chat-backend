
const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res= response) => {

  const {email,password} = req.body;

  try{
    
    const existeEmail = await Usuario.findOne({ email:email });

    if(existeEmail){
        return res.status(400).json({
            ok:false,
            msg: "El correo ya esta registrado"
        })
    }

    const usuario= new Usuario(req.body);

    //Encriptar contraseña;
    const salt = bcrypt.genSaltSync();
    usuario.password =bcrypt.hashSync(password,salt);


    await usuario.save();

    //Generar mi JWT
    const token = await generarJWT( usuario.id );

  
    res.json({
        ok:true,
        usuario,
        token
    })


  }catch(error){
    console.log(error);
    res.status(500).json({
        ok:false,
        msg:"Hable con el administrador"
    })
  }

}

//const login...req, res....
//{ok:true,msg:'login'}

const login = async (req, res= response) => {

    const {email,password} = req.body;
  
    try{
      
        const usuarioDB = await Usuario.findOne({ email:email });
  
        if(!usuarioDB){
          return res.status(404).json({
              ok:false,
              msg: "El correo no existe"
          })
        }

        //ValidarPassword
        const validPassword = bcrypt.compareSync(password,usuarioDB.password);

        if(!validPassword){//Contrasela incorrecta
            return res.status(400).json({
                ok:false,
                msg: "Contraseña incorrecta"
            })
        }

        //Email y password validos, generar JWT
        const token = await generarJWT(usuarioDB.id)
         
   
        res.json({
          ok:true,
          usuario:usuarioDB,
          token
        })
  
  
    }catch(error){

      console.log(error);
      res.status(500).json({
          ok:false,
          msg:"Hable con el administrador"
      })
    }
  
}

const renewToken = async (req,res = response)=> {

  //const uid del usuario
  //GENERAR UN NUEVOJWT, gwenerarJWT...uid...
  //Obtener el usuario por el UID, Usuario.findById...
 
  const uid = req.uid;

  const token = await generarJWT( uid );//Genera un nuevo token con el uid del usuario

  const usuario = await Usuario.findById({ _id:uid });

  res.json({
    ok:true,
    usuario,
    token 
  })
}



module.exports = {
    crearUsuario,
    login,
    renewToken
}