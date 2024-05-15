// CONTROLLER -> usuarios.js
/*
    El controlador es el componente responsable de manejar las interacciones del usuario y actualizar el modelo y la vista en consecuencia, 
    es decir, actúa como un intermediario entre el modelo y la vista, gestionando las interacciones del usuario y asegurando que el estado 
    de la aplicación se actualice y se presente correctamente al usuario.
*/
// ----------------------------------------------------------------------------

// Librerias
const { matchedData } = require('express-validator')
// Módulos propios
const { userModel } = require('../models')
const { handleHttpError } = require('../utils/handleError')
const { encrypt, compare } = require('../utils/handlePassword')
const { tokenSignUsuario, verifyToken } = require('../utils/handleJwt')

/*
  FUNCION
    getItems(req, res)
    Obtener la lista de usuarios.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía la lista de comercios como respuesta si la operación es exitosa. En caso de error, envía una respuesta de error con código 500.
*/
const getItems = async (req, res) => {
  try {

    // Obtenemos todos los usuarios
    const data = await userModel.find({}).exec()

    // Enviamos los datos
    res.send(data) 
  } catch (err) {
    handleHttpError(res, 'ERROR_GET_ITEMS', 500) // Si hay un error, enviamos un error HTTP
  }
}

/*
  FUNCION
    getFilterItems(req, res)
    Obtener usuarios por sus intereses si esta la flag true.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía la lista de comercios como respuesta si la operación es exitosa. En caso de error, envía una respuesta de error con código 500.
*/
const getFilterItems = async (req, res) => {
  try {

    // Obtenemos la ciudad del comercio autorizado
    const ciudadComercio = req.comercio.ciudad

    console.log(ciudadComercio)

    // Obtenemos los usuarios que tengan la flag de ofertas a true y la misma ciudad que el comercio
    const data = await userModel.find({
        ofertas: true,
        ciudad: ciudadComercio
    })

    console.log(data)

    // Comprobamos si data es undefined
    if (!data) {
      return handleHttpError(res, 'ERROR_GET_ITEM: No se encontró ningún usuario con la misma ciudad', 404) // Indicamos un mensaje así como el código de error
    }

    // Extraer los emails de los usuarios encontrados
    const emails = data.map(data => data.correo)

    // Enviamos los emails
    res.send(emails) 

  } catch (error) {
    console.error(error);
    handleHttpError(res, 'ERROR_GET_ITEMS', 500);
  }

}

/*
  FUNCION
    getItem(req, res)
    Obtener un usuario por su correo.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del comercio como respuesta si la operación es exitosa. Si no se encuentra el comercio, envía una respuesta de error con código 404. 
        En caso de error, envía una respuesta de error con código 500.
*/
const getItem = async (req, res) => {
    try {
        // Recuperamos el CIF de la URL
        const { correo } = matchedData(req) 

        // Buscamos si el CIF (_CIF) proporcionado coincide con alguno en la BD
        const data = await userModel.findOne({ correo:correo }) // Como en la BD el campo se llama CIF, indicamos que compare CIF con nuestra varible _CIF
        
        // Comprobamos si data es undefined
        if (!data) {
            return handleHttpError(res, 'ERROR_GET_ITEM: No se encontró ningún usuario con el correo proporcionado', 404) // Indicamos un mensaje así como el código de error
        }

        // Envaimos data
        res.send({ data })
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_ITEM', 500)
    }
}

/*
  FUNCION
    createItem(req, res)
    Guardar un nuevo usuario.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del nuevo comercio creado como respuesta si la operación es exitosa. Si el CIF o el correo ya existen, envía una respuesta de error con código 409. 
        En caso de error, envía una respuesta de error con código 500.
*/
const createItem = async (req, res) => {
    try {
        // Recuperamos la información que hay en el body
        const body = matchedData(req) 

        // Recuperamos el correo del body
        const { correo } = matchedData(req) 

        // Buscamos si el correo coincide con alguno de la BD
        const isCorreo = await userModel.findOne({ correo }) 
        
        // Comprobamos si isCorreo es true
        if (isCorreo) {
          return handleHttpError(res, 'ERROR_CREATE_ITEM: El correo proporcionado ya existe', 409) // Indicamos un mensaje así como el código de error
        }

        // Encriptamos la password
        const password = await encrypt(body.password)

        // Duplicamos el objeto y sobreescribimos la password cifrada
        const usuario = { ...body, password }

        // Creamos el usuario
        const dataUsuario = await userModel.create(usuario)

        console.log(dataUsuario)
        
        // Quitamos el password para que no se muestre
        dataUsuario.set('password', undefined, { strict: false })

        const data = {
          // Generamos un token para el comercio creado
          token: await tokenSignUsuario(dataUsuario),

          // Guardamos toda la información del comercio (sin la password)
          usuario: dataUsuario
        }

        // Enviamos data
        res.send(data)
    } catch(err) {
        console.log(err)
        handleHttpError(res, 'ERROR_CREATE_ITEM', 500)
    }
}

/*
  FUNCION
    updateItem(req, res)
    Modificar un usuario existente por su correo (como un PATCH).
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del comercio modificado como respuesta si la operación es exitosa. Si no se encuentra el comercio, envía una respuesta de error con código 404. 
        En caso de error, envía una respuesta de error con código 500.
*/
const updateItem = async (req, res) => {
    
  try {  
      // Recuperamos la información que hay en el body
      const body = matchedData(req) 

      // Recuperamos el correo de la URL
      const { correo } = matchedData(req) 
      
      // Buscamos si el CIF coincide con alguno en la BD
      const isCorreo = await userModel.findOne({ correo:correo })

      // Comprobomaos si isCIF es nulo
      if (!isCorreo) {
        return handleHttpError(res, 'ERROR_UPDATE_ITEM: No se encontró ningún usuario con el correo proporcionado', 404) // Indicamos un mensaje así como el código de error
      }

      // Actualizamos el comercio con findONEAndUpdate que sólo actualiza los campos que se han indicado
      const data = await userModel.findOneAndUpdate({ correo:correo } , body)
        
      // Enviamos data
      res.send(data)

    } catch (err) {
      handleHttpError(res, 'ERROR_UPDATE_ITEM', 500)
    }
}

/*
  FUNCION
    deleteItem(req, res)
    Borrar un usuario por su correo, permitiendo elegir entre borrado lógico o físico.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del comercio borrado como respuesta si la operación es exitosa. Si no se encuentra el comercio, envía una respuesta de error con código 404. 
        En caso de error, envía una respuesta de error con código 500.
*/
const deleteItem = async (req, res) => {
    
    try {
        // Recuperamos el correo de la URL
        const { correo } = matchedData(req)

        // Inicializamos la variabla data
        let data
        
        // Buscamos si el correo proporcionado coincide con alguno en la BD
        data = await userModel.findOne({ correo:correo }) // Como en la BD el campo se llama CIF, indicamos que compare CIF con nuestra varible _CIF
        
        // Comprobamos si data es undefined
        if (!data) {
            return handleHttpError(res, 'ERROR_DELETE_ITEM: No se encontró ningún usuario con el correo proporcionado', 404) // Indicamos un mensaje así como el código de error
        }

 
        data = await userModel.findOneAndDelete({ correo:correo })
        
        // Envaimos un confirmación del borrado y data
        res.send(data)
    } catch (err) {
        handleHttpError(res, 'ERROR_DELETE_ITEM', 500)
    } 
}

/*
  FUNCION
    loginItem(req, res)
    Iniciar sesión de un usuario con su correo y contraseña.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del comercio que ha iniciado sesión asi como su token como respuesta si la operación es exitosa. 
        En caso de error, envía una respuesta de error con código 500.
*/
const loginItem = async (req, res) => {
  try {
      // Recuperamos la información que hay en el body
      const body = matchedData(req) 

      // Buscams el comercio en la BD utilizando el correo proporcionado
      const usuario = await userModel.findOne({ correo: body.correo })

      // Verificamos si el comercio existe
      if (!usuario) {
          return handleHttpError(res, 'ERROR_LOGIN: El correo proporcionado no existe', 404) // Indicamos un mensaje así como el código de error
      }

      // Compararamos la contraseña proporcionada con la contraseña almacenada en la BD
      const passwordMatch = await compare(body.password, usuario.password)
      
      // Verificamos si las contraseñas coinciden
      if (!passwordMatch) {
        return handleHttpError(res, 'ERROR_LOGIN: Credenciales inválidos', 401) // Indicamos un mensaje así como el código de error

      }

      // Eliminamos la contraseña del objeto de comercio antes de enviar la respuesta (No se mostrará)
      usuario.set('password', undefined, { strict: false });

      const data = {
        // Generramos un token para el comercio creado
        token: await tokenSignUsuario(usuario),

        // Guardamos toda la información del comercio
        usuario: usuario
      }

      // Enviamos data
      res.send(data)
  } catch(err) {
    console.log(err)
      handleHttpError(res, 'ERROR_LOGIN', 500)
  }
}

module.exports = { getItems, getFilterItems, getItem, createItem, updateItem, deleteItem, loginItem }