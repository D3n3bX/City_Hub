// UTILS -> handlePassword.js
/*
    Esta utilidad cifra las contraseñas así como comparar una contraseña en texto plano con su correspondient hash.
*/
// ----------------------------------------------------------------------------

const bcryptjs = require('bcryptjs')

/*
  FUNCION
    encrypt(clearPassword)
    Función para cifrar una contraseña utilizando el algoritmo bcrypt
    Parámetros:
      - clearPassword: Contraseña en texto plano que se desea cifrar
    Return:
      - Hash cifrado de la contraseña
*/
const encrypt = async (clearPassword) => {
    // Ciframos la contraseña
    const hash = await bcryptjs.hash(clearPassword, 10)

    // Devolvemos el hash
    return hash
}

/*
  FUNCION
    compare(clearPassword, hashedPassword)
    Función para comparar una contraseña en texto plano con su correspondiente hash cifrado
    Parámetros:
      - clearPassword: Contraseña en texto plano que se desea comparar
      - hashedPassword: Hash cifrado de la contraseña almacenada en la base de datos
    Return:
      - Booleano que indica si la contraseña en texto plano coincide con su hash cifrado
*/
const compare = async (clearPassword, hashedPassword) => {
    // Comparamos entre la password en texto plano y su hash calculado anteriormente
    const result = await bcryptjs.compare(clearPassword, hashedPassword)

    // Devolvemos result
    return result
}

module.exports = { encrypt, compare }