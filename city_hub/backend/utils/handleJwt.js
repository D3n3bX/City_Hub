// UTILS -> handleJwt.js
/*
    Esta utilidad proporciona funciones relacionadas con la generación y verificación de tokens JWT.
*/
// ----------------------------------------------------------------------------

// Librerias
const jwt = require('jsonwebtoken')

// Obtenemos el secreto JWT de las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET

/*
  FUNCION
    tokenSignComercio(comercio)
    Función para generar un token JWT utilizando la información del comercio y el secreto JWT.
  Parámetros:
    - user: Objeto de usuario con al menos un atributo _id y un atributo CIF
  Return:
    - Devuelve el token JWT firmado
*/
const tokenSignComercio = (comercio) => {
  try {
      // Generamos el token JWT
      const sign = jwt.sign(
          {   
              _id: comercio._id,
              CIF: comercio.CIF
          },
          JWT_SECRET,
          {
              expiresIn: '1y' // Para que expire en 1 año
          }
      )

      return sign
  } catch (error) {
      console.error('Error al generar el token:', error)
      throw error // Lanzar el error para que sea capturado por el bloque catch en createItem
  }
}

/*
  FUNCION
    tokenSignUsuario(usuario)
    Función para generar un token JWT utilizando la información del usuario y el secreto JWT.
  Parámetros:
    - user: Objeto de usuario con al menos un atributo _id y un atributo rol
  Return:
    - Devuelve el token JWT firmado
*/
const tokenSignUsuario = (usuario) => {
  try {
      // Generamos el token JWT
      const sign = jwt.sign(
          {   
              _id: usuario._id,
              rol: usuario.rol
          },
          JWT_SECRET,
          {
              expiresIn: '1y' // Para que expire en 1 año
          }
      )

      return sign
  } catch (error) {
      console.error('Error al generar el token:', error)
      throw error // Lanzar el error para que sea capturado por el bloque catch en createItem
  }
}

/*
  FUNCION
    verifyToken(tokenJwt)
    Función para verificar la validez de un token JWT utilizando el secreto JWT.
  PARÁMETROS:
    - tokenJwt: Token JWT a verificar
  RETORNO:
    - Si el token es válido, devuelve el contenido decodificado del token.
    - Si el token no es válido, se captura el error y se imprime en la consola.
*/
const verifyToken = (tokenJwt) => {
    try {
        // Verificamos el token JWT
        return jwt.verify(tokenJwt, JWT_SECRET)
        
    } catch(err) {
        console.log(err)
    }
}

module.exports = { tokenSignComercio, tokenSignUsuario, verifyToken }
