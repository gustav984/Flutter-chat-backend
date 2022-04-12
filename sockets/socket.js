const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado,usuarioDesconectado,grabarMensaje } = require('../controllers/socket');


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    const [ valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    
    console.log(valido,uid);

    //Verificar autentificacion
    if( !valido ){
      return client.disconnect();
    } 
    
    console.log('Cliente autenticado');
    //Cliente autenticado
    usuarioConectado(uid);

    //Ingresar al usuario a una sala particular
    //Sala global, client.id, 6246150370a5417244bf0ea0
    client.join( uid );


    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);
        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    });

    client.on('mensaje-personal',async( payload) =>{
        //TODO Grabar mensaje
        await grabarMensaje(payload);
        io.to( payload.para).emit('mensaje-personal', payload );
    })


});
