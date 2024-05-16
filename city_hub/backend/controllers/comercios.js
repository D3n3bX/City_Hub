// CONTROLLER -> comercio.js
/*
    El controlador es el componente responsable de manejar las interacciones del usuario y actualizar el modelo y la vista en consecuencia, 
    es decir, actúa como un intermediario entre el modelo y la vista, gestionando las interacciones del usuario y asegurando que el estado 
    de la aplicación se actualice y se presente correctamente al usuario.
*/
// ----------------------------------------------------------------------------

// Librerias
const { matchedData } = require('express-validator')
// Módulos propios
const { comercioModel } = require('../models')
const { handleHttpError } = require('../utils/handleError')
const { encrypt, compare } = require('../utils/handlePassword')
const { tokenSignComercio, verifyToken } = require("../utils/handleJwt")

/*
  FUNCION
    getItems(req, res)
    Obtener la lista de comercios, opcionalmente ordenados por CIF ascendentemente.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía la lista de comercios como respuesta si la operación es exitosa. En caso de error, envía una respuesta de error con código 500.
*/
const getItems = async (req, res) => {
    try {
        let query = comercioModel.find({})
        
        const { orderByCIF } = req.query // Verificamos si se ha solicitado que se ordene por CIF

        // Se ha solicitado que se ordene por CIF
        if (orderByCIF) {
            query = query.sort({ CIF: 1 })
        }

        const data = await query.exec()
        res.send(data)
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_ITEMS', 500)
    }
}

/*
  FUNCION
    getItem(req, res)
    Obtener un comercio por su CIF.
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
        const { _CIF } = matchedData(req)
        
        // Buscamos si el CIF (_CIF) proporcionado coincide con alguno en la BD
        const data = await comercioModel.findOne({ CIF:_CIF }) // Como en la BD el campo se llama CIF, indicamos que compare CIF con nuestra varible _CIF
      
        // Comprobamos si data es undefined
        if (!data) {
            return handleHttpError(res, 'ERROR_GET_ITEM: No se encontró ningún comercio con el CIF proporcionado', 404) // Indicamos un mensaje así como el código de error
        }

        // Envaimos data
        res.send({ data })
    } catch (err) {
        handleHttpError(res, 'ERROR_GET_ITEM', 500)
    }
}

/*
  FUNCION
    getItemActivity(req, res)
    Obtener comercios por su actividad.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del comercio como respuesta si la operación es exitosa. Si no se encuentra el comercio, envía una respuesta de error con código 404. 
        En caso de error, envía una respuesta de error con código 500.
*/
const getItemActivity = async (req, res) => {
  try {

      // Recuperamos el CIF de la URL
      const { _actividad } = matchedData(req)

      // Buscamos los comercios cuya actividad incluya la cadena proporcionada
      const data = await comercioModel.find({ actividad: { $regex: _actividad, $options: 'i' } })
  
      // Comprobamos si data es undefined
      if (!data) {
          return handleHttpError(res, 'ERROR_GET_ITEM: No se encontró ningún comercio con la actividad proporcionada', 404) // Indicamos un mensaje así como el código de error
      }

      // Envaimos data
      res.send({ data })
  } catch (err) {
      handleHttpError(res, 'ERROR_GET_ITEM', 500)
  }
}

/*
  FUNCION
    getItemCity(req, res)
    Obtener comercios por su ciudad.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del comercio como respuesta si la operación es exitosa. Si no se encuentra el comercio, envía una respuesta de error con código 404. 
        En caso de error, envía una respuesta de error con código 500.
*/
const getItemCity = async (req, res) => {
  try {

      // Recuperamos el CIF de la URL
      const { _ciudad } = matchedData(req)

      // Buscamos los comercios cuya actividad incluya la cadena proporcionada
      const data = await comercioModel.find({ ciudad:_ciudad })
  
      // Comprobamos si data es undefined
      if (!data) {
          return handleHttpError(res, 'ERROR_GET_ITEM: No se encontró ningún comercio con la actividad proporcionada', 404) // Indicamos un mensaje así como el código de error
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
    Guardar un nuevo comercio.
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

        // Recuperamos el CIF y el correo del body
        const { CIF, correo } = matchedData(req) 
        
        // Buscamos si el CIF coincide con alguno en la BD
        const isCIF = await comercioModel.findOne({ CIF }) // En este caso el nombre del campo, CIF, coincide con el nombre de nuestra variable CIF, por lo que no es necesario { CIF:_CIF }

        // Buscamos si el correo coincide con alguno de la BD
        const isCorreo = await comercioModel.findOne({ correo }) 

        // Comprobamos si isCIF es true
        if (isCIF) {
          return handleHttpError(res, 'ERROR_CREATE_ITEM: El CIF proporcionado ya existe', 409) // Indicamos un mensaje así como el código de error
        }
        
        // Comprobamos si isCorreo es true
        if (isCorreo) {
          return handleHttpError(res, 'ERROR_CREATE_ITEM: El correo proporcionado ya existe', 409) // Indicamos un mensaje así como el código de error
        }

        // Encriptamos la password
        const password = await encrypt(body.password)

        // Duplicamos el objeto y sobreescribimos la password cifrada
        const comercio = { ...body, password }

        // Creamos el comercio
        const dataComercio = await comercioModel.create(comercio)
        
        // Quitamos el password para que no se muestre
        dataComercio.set('password', undefined, { strict: false })

        const data = {
          // Generamos un token para el comercio creado
          token: await tokenSignComercio(dataComercio),

          // Guardamos toda la información del comercio (sin la password)
          comercio: dataComercio
        }

        // Enviamos data
        res.send(data)
    } catch(err) {
        handleHttpError(res, 'ERROR_CREATE_ITEM', 500)
    }
}

/*
  FUNCION
    updateItem(req, res)
    Modificar un comercio existente por su CIF (como un PATCH).
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

      console.log(body)
      // Recuperamos el CIF de la URL
      const { _CIF } = matchedData(req) 

      // Buscamos si el CIF coincide con alguno en la BD
      const isCIF = await comercioModel.findOne({ CIF:_CIF })

      // Comprobomaos si isCIF es nulo
      if (!isCIF) {
        return handleHttpError(res, 'ERROR_UPDATE_ITEM: No se encontró ningún comercio con el CIF proporcionado', 404) // Indicamos un mensaje así como el código de error
      }

      // Actualizamos el comercio con findONEAndUpdate que sólo actualiza los campos que se han indicado
      const data = await comercioModel.findOneAndUpdate({ CIF:_CIF } , body)
        
      // Enviamos data
      res.send(data)

    } catch (err) {
      handleHttpError(res, 'ERROR_UPDATE_ITEM', 500)
    }
}

/*
  FUNCION
    deleteItemCommerce(req, res)
    Borrar un comercio por su CIF, permitiendo con un borrado lógico.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del comercio borrado como respuesta si la operación es exitosa. Si no se encuentra el comercio, envía una respuesta de error con código 404. 
        En caso de error, envía una respuesta de error con código 500.
*/
const deleteItemComercio = async (req, res) => {
    
    try {
        // Recuperamos el CIF de la URL
        const { _CIF } = matchedData(req)
        
        // Inicializamos la variabla data
        let data
        
        // Buscamos si el CIF (_CIF) proporcionado coincide con alguno en la BD
        data = await comercioModel.findOne({ CIF:_CIF }) // Como en la BD el campo se llama CIF, indicamos que compare CIF con nuestra varible _CIF
        
        // Comprobamos si data es undefined
        if (!data) {
            return handleHttpError(res, 'ERROR_DELETE_ITEM: No se encontró ningún comercio con el CIF proporcionado', 404) // Indicamos un mensaje así como el código de error
        }

        // Hacemos un softDelete, es decir en la BD lo marcamos como deleted
        data = await comercioModel.delete({ CIF: _CIF }) 

        // Envaimos un confirmación del borrado y data
        res.send({ acknowledged: true, data })
    } catch (err) {
        handleHttpError(res, 'ERROR_DELETE_ITEM', 500)
    } 
}

/*
  FUNCION
  deleteItemCommerce(req, res)
  Borrar un comercio por su CIF, permitiendo con un borrado lógico.
  Parámetros:
    - req: Objeto de solicitud de Express
    - res: Objeto de respuesta de Express
  Return:
    - Envía los datos del comercio borrado como respuesta si la operación es exitosa. Si no se encuentra el comercio, envía una respuesta de error con código 404. 
      En caso de error, envía una respuesta de error con código 500.
*/
const deleteItemAdmin = async (req, res) => {

try {
    // Recuperamos el CIF de la URL
    const { _CIF } = matchedData(req)
    
    // Inicializamos la variabla data
    let data
    
    // Buscamos si el CIF (_CIF) proporcionado coincide con alguno en la BD
    data = await comercioModel.findOne({ CIF:_CIF }) // Como en la BD el campo se llama CIF, indicamos que compare CIF con nuestra varible _CIF
    
    // Comprobamos si data es undefined
    if (!data) {
        return handleHttpError(res, 'ERROR_DELETE_ITEM: No se encontró ningún comercio con el CIF proporcionado', 404) // Indicamos un mensaje así como el código de error
    }

    // Hacemos un borrado físico
    data = await comercioModel.deleteOne({ CIF: _CIF }) 

    // Envaimos un confirmación del borrado y data
    res.send({ acknowledged: true, data })

} catch (err) {
    handleHttpError(res, 'ERROR_DELETE_ITEM', 500)
} 
}

/*
  FUNCION
    loginItem(req, res)
    Iniciar sesión de un comercio con su correo y contraseña.
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

      // BUscams el comercio en la BD utilizando el correo proporcionado
      const comercio = await comercioModel.findOne({ correo: body.correo })

      // Verificamos si el comercio existe
      if (!comercio) {
          return handleHttpError(res, 'ERROR_LOGIN: El correo proporcionado no existe', 404) // Indicamos un mensaje así como el código de error
      }

      // Compararamo la contraseña proporcionada con la contraseña almacenada en la BD
      const passwordMatch = await compare(body.password, comercio.password)
  
      // Verificamos si las contraseñas coinciden
      if (!passwordMatch) {
        return handleHttpError(res, 'ERROR_LOGIN: Credenciales inválidos', 401) // Indicamos un mensaje así como el código de error

      }

      // Eliminamos la contraseña del objeto de comercio antes de enviar la respuesta (No se mostrará)
      comercio.set('password', undefined, { strict: false })

      const data = {
        // Generramos un token para el comercio creado
        token: await tokenSignComercio(comercio),

        // Guardamos toda la información del comercio
        comercio: comercio
      }

      // Enviamos data
      res.send(data)
  } catch(err) {
      handleHttpError(res, 'ERROR_LOGIN', 500)
  }
}

/*
  FUNCION
    uploadInfoItem(req, res)
    Subir información de un comercio por su CIF.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del comercio borrado como respuesta si la operación es exitosa. Si no se encuentra el comercio, envía una respuesta de error con código 404. 
        En caso de error, envía una respuesta de error con código 500.
*/
const uploadInfoItem = async (req, res) => {
  try {

    // Recuperamos la información que hay en el body
    const body = matchedData(req)

    // Recuperamos el CIF de la URL y el file
    const { _CIF } = matchedData(req)

    // Buscamos si el CIF coincide con alguno en la BD
    const isCIF = await comercioModel.findOne({ CIF: _CIF })

    // Comprobamos si isCIF es nulo
    if (!isCIF) {
      return handleHttpError(res, "ERROR_UPLOAD_ITEM: No se encontró ningún comercio con el CIF proporcionado", 404) // Indicamos un mensaje así como el código de error
    }

    // Actualizamos el comercio con findOneAndUpdate
    const data = await comercioModel.findOneAndUpdate(
      // Indicamos el CIF del comercio a modificar
      { CIF: _CIF },
      {
        // Atributos de la BD que se sobreescribirán
        $set: {
          titulo: body.titulo, // Modifica el título
          resumen: body.resumen, // Modifica el resumen
        },
        // Atributos de la BD que se añadirán sin sobreescribir lo anterior
        $push: {
          textos: body.textos, // Agrega el nuevo texto al array existente
        },
      },
      { new: true } // Esto devuelve el documento actualizado
    )

    // Enviamos data
    res.send(data)
  } catch (err) {
    handleHttpError(res, "ERROR_DELETE_ITEM", 500)
  }
}


/*
  FUNCION
    reviewItem(req, res)
    Publicar una valoración de un comercio existente por su CIF.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del comercio modificado como respuesta si la operación es exitosa. Si no se encuentra el comercio, envía una respuesta de error con código 404. 
        En caso de error, envía una respuesta de error con código 500.
*/
const reviewItem = async (req, res) => {
    
  try {  
      // Recuperamos la información que hay en el body
      const body = matchedData(req) 

      // Recuperamos el CIF de la URL
      const { _CIF } = matchedData(req) 
      
      // Buscamos si el CIF coincide con alguno en la BD
      const isCIF = await comercioModel.findOne({ CIF:_CIF })

      // Comprobomaos si isCIF es nulo
      if (!isCIF) {
        return handleHttpError(res, 'ERROR_UPDATE_ITEM: No se encontró ningún comercio con el CIF proporcionado', 404) // Indicamos un mensaje así como el código de error
      }

    // Actualizamos el comercio con findOneAndUpdate que sólo actualiza los campos que se han indicado
    const data = await comercioModel.findOneAndUpdate(
      // Indicamos el CIF del comercio a modificar
      { CIF: _CIF },
      {
        // Atributos de la BD que se añadirán sin sobreescribir lo anterior
        $push: {
          scoring: body.scoring, // Agrega el nuevo scoring
          review: body.review, // Agrega la nueva review
        },
      },
      { new: true } // Esto devuelve el documento actualizado
    )

      // Enviamos data
      res.send(data)

    } catch (err) {
      handleHttpError(res, 'ERROR_UPDATE_ITEM', 500)
    }
}


/*
  FUNCION
    createFile(req, res)
    Publicar una foto de un comercio existente por su CIF.
    Parámetros:
      - req: Objeto de solicitud de Express
      - res: Objeto de respuesta de Express
    Return:
      - Envía los datos del fichero subido como respuesta si la operación es exitosa. Si no se encuentra el comercio, envía una respuesta de error con código 404. 
        En caso de error, envía una respuesta de error con código 500.
*/
const createFile = async (req, res) => {
  try {

    // Recuperamos el CIF
    const { _CIF } = matchedData(req)

    // Recuperamos la información del body y del file
    const { body, file } = req

    console.log(file)


    // Verificamos si hay archivos
    if (!file || file.length === 0) {
      return handleHttpError(res, "Fotos no proporcionadas", 400)
    }

    // Buscamos si el CIF coincide con alguno en la BD
    const isCIF = await comercioModel.findOne({ CIF: _CIF })

    // Comprobamos si isCIF es nulo
    if (!isCIF) {
      return handleHttpError(
        res, "ERROR_UPDATE_ITEM: No se encontró ningún comercio con el CIF proporcionado", 404) // Indicamos un mensaje así como el código de error
    }

    // Actualizamos el comercio con el archivo
    const updatedComercio = await comercioModel.findOneAndUpdate(
      { CIF: _CIF },
      {
        $set: {
          file: {
            filename: file.filename,
            url: process.env.PUBLIC_URL + "/" + file.filename,
          },
        },
      },
      { new: true }
    )

    res.send(updatedComercio)
  } catch (err) {
    handleHttpError(res, "ERROR_CREATE_FILE", 500)
  }
}


module.exports = { getItems, getItem, getItemActivity, getItemCity, createItem, updateItem, uploadInfoItem,  deleteItemComercio, deleteItemAdmin, loginItem, reviewItem, createFile }