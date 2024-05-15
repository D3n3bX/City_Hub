// UTILS -> handleError.js
/*
    Esta utilidad envia respuestas de error HTTP con un mensaje y un código de estado específicos.
*/
// ----------------------------------------------------------------------------

/*
  FUNCION
    handleHttpError(res, message, code = 403)
    Función para manejar errores HTTP y enviar una respuesta adecuada.
    Parámetros:
        - res: Objeto de respuesta de Express
        - message: Mensaje de error a enviar en la respuesta
        - code: Código de estado HTTP (por defecto 403)
    Return:
        - Envía una respuesta con el mensaje de error y el código de estado HTTP correspondiente.
*/
const handleHttpError = (res, message, code = 403) => {
    console.log(message)
    res.status(code).send(message)
}

module.exports = { handleHttpError }