// MIDDLEWARE -> rol.js
/*
    Este middleware se encarga de comprobar el rol del usuario
*/
// -

// Módulos propios
const { handleHttpError } = require('../utils/handleError')

/*
  FUNCION
    checkRol(roles)
    Middleware para verificar si el usuario tiene uno de los roles requeridos.
  Parámetros:
    - roles: Array de roles requeridos para acceder al recurso protegido.
  Return:
    - Una función middleware que verifica si el usuario tiene uno de los roles requeridos.
    - Si el usuario no tiene uno de los roles requeridos, se envía un error HTTP 403.
*/
const checkRol = (roles) => (req, res, next) => {
    try {
        // Obtenemos el usuario de la solicitud
        const { user } = req

        // Obtenemos los roles del usuario (debería ser un array según los datos del token)
        const userRoles = user.rol

        // Verificamos si el usuario tiene alguno de los roles requeridos
        const hasRole = userRoles.some(role => roles.includes(role))
        
        // Si el usuario no tiene ninguno de los roles requeridos 
        if (!hasRole) {
            handleHttpError(res, 'NOT_ALLOWED', 403) // Enviamos un error HTTP 403
            return
        }

        // Si el usuario tiene uno de los roles requeridos, pasamos al siguiente midleware
        next()
    } catch (err) {
        console.log(err)
        handleHttpError(res, 'ERROR_PERMISSIONS', 403)
    }
}

module.exports = checkRol
