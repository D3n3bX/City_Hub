// MIDDLEWARE -> customHeader.js
/*
    Este middleware verifica si la solicitud incluye una clave de API válida en el encabezado api_key 
    y permite que la solicitud continúe si la clave de API es correcta.
*/
// ----------------------------------------------------------------------------

/*
  FUNCION
    customHeader(req, res, next)
    Verifica una clave API en la cabecera de la solicitud.
    Parámetros:
        - req: Objeto de solicitud de Express
        - res: Objeto de respuesta de Express
        - next: Función de middleware de Express para pasar al siguiente middleware o acción
    Return:
        - Si la clave API proporcionada en la cabecera coincide con la clave API almacenada en las variables de entorno, pasa al siguiente middleware.
        - Si la clave API no coincide, devuelve un código de estado HTTP 403 (Forbidden) y un mensaje indicando que la clave API no es correcta.
        - Si hay algún error durante la ejecución, devuelve un código de estado HTTP 403 (Forbidden) y un mensaje de error.
*/
function customHeader (req, res, next) {
    try {
        const apiKey = req.headers.api_key // Obtenemos del header la api_key

        if(apiKey === process.env.API_KEY) { //Probar con otra para ver el error
            next()
        } else {
            res.status(403).send("API KEY no es correcto")
        }
    } catch(err) {
            res.status(403).send(err)
    }
}

module.exports = customHeader