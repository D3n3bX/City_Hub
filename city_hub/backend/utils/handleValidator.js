// UTILS -> handleValidator.js
/*
    Esta utilidad valida los datos de la solicitud utilizando express-validator 
    y enviar una respuesta adecuada si se encuentran errores de validación.
*/
// ----------------------------------------------------------------------------

// Librerías
const { validationResult } = require('express-validator')

/*
    FUNCION
      validateResults(req, res, next)
      Función para validar los datos de la solicitud utilizando express-validator 
      y enviar una respuesta adecuada si se encuentran errores de validación.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
      - next: Función de middleware para pasar el control al siguiente middleware
    Return:
      - Llama a la función `next()` si no hay errores de validación. De lo contrario, envía una respuesta de error con código 403 y detalles de los errores en formato JSON
*/
const validateResults = (req, res, next) => {
    try {   
            // Obtenermos el resultado de las validaciones realizadas
            validationResult(req).throw() 

            // Devolvemos next() para que pase al siguiente middleware en caso de que no haya errores
            return next() 
        } catch (err) {
            res.status(403).send({ errors: err.array() }) // En caso de errores devolemos un Forbidden (403) y una respuesta JSON
        }
}

module.exports = validateResults