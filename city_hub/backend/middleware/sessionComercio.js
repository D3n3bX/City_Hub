// MIDDLEWARE -> sessionComercio.js
/*
    Este middleware se encarga de la autenticación de los comercios
*/
// ----------------------------------------------------------------------------

// Módulos propios
const { handleHttpError } = require('../utils/handleError')
const { verifyToken } = require('../utils/handleJwt')
const { comercioModel, userModel } = require("../models")

/*
  FUNCION
    authMiddleware(req, res, next)
    Función para autenticación de usuarios mediante token JWT
  Parámetros:
    - req: Objeto de solicitud de Express
    - res: Objeto de respuesta de Express
    - next: Función de callback para pasar al siguiente middleware
  Return:
    - Si la autenticación es exitosa, pasa al siguiente middleware.
    - Si no hay un token en la cabecera de autorización, envía un error HTTP 401.
    - Si hay un error en la verificación del token, envía un error HTTP 401.
    - Si no se encuentra un usuario correspondiente al ID del token, envía un error HTTP 401.
*/
const authComercioMiddleware = async (req, res, next) => {
    try{
        // Verificamos si existe un token en la cabecera
        if (!req.headers.authorization) {
            handleHttpError(res, "NOT_TOKEN", 401) // Indicamos un mensaje así como el código de error
            return
        }
    
        // Separamos el token de la cabecera 'Bearer'
        const arrayTok = req.headers.authorization.split(' ')
        const token = arrayTok[1]
        const isBearer = arrayTok[0]

        // Verificamos el formato del token
        const dataToken = await verifyToken(token)

        if(!dataToken._id || isBearer != 'Bearer') {
            handleHttpError(res, "ERROR_ID_TOKEN", 401) // Indicamos un mensaje así como el código de error
            return
        }

        // Buscamos al comercio correspondiente al id
        const comercio = await comercioModel.findById(dataToken._id)
 
        // Establecemos el comercio en la solicitud para uso posterior
        req.comercio = comercio
        
        // Pasamos al siguiente middelware
        next()
    } catch(err){
        console.log(err)
        handleHttpError(res, "NOT_SESSION", 401) // Indicamos un mensaje así como el código de error
    }
}

module.exports =  authComercioMiddleware 