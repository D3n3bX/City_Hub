// MIDDLEWARE -> cif.js
/*
    Este middleware se encarga de compronar que el CIF del token coincide con el CIF de la URL
*/
// -

// Librerias
const { matchedData } = require('express-validator')
// Módulos propios
const { handleHttpError } = require('../utils/handleError')

/*
  FUNCION
    checkCIF()
    Middleware para verificar si el CIF coincide con el de la URL.
  Parámetros:
    - Ninguno
  Return:
    - Si el CIF es exitosa, pasa al siguiente middleware.
    - Si el CIF no es exitosa, se envía un error HTTP 403.
    - Si el comercio no tiene el CIF de la URL, se envía un error HTTP 403.
*/
const checkCIF = (req, res, next) => {
    try {
      
        // Recuperamos el CIF de la URL
        const { _CIF } = matchedData(req)

        // Recuperamos el comercio del middleware de autenticación
        const tokComercio = req.comercio

        // Recuperamos el CIF del token
        const tokCIF = tokComercio.CIF

        // Comprobamos que el _CIF de la URL y el tokCIF (CIF del token) no coinciden
        if (_CIF != tokCIF) {
            return handleHttpError(res, 'ERROR_PERMISOS: No tiene permiso para actualizar este comercio', 403) // Indicamos un mensaje así como el código de error
        }

        // En caso contrario pasamos al siguiente midleware
        next()
    } catch (err) {
        console.log(err)
        return handleHttpError(res, 'ERROR_PERMISOS: No se pudo verificar el CIF del comercio', 403)
    }
}

module.exports = checkCIF

