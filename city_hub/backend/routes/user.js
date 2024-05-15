// ROUTES -> user.js
/*
    Las routes definen cómo se accede y se interactúa con los recursos de la aplicación a través de URLs específicas, 
    y proporcionan una estructura para manejar las solicitudes HTTP entrantes de manera efectiva y coherente.

    La estructura es router.<peticion>.('URL', <middlewares>, <controlador>)
*/
// ----------------------------------------------------------------------------

// Librerias
const express = require('express')
// Módulos propios
const { getItems, getFilterItems, getItem, createItem, updateItem, deleteItem, loginItem } = require('../controllers/user')
const { validatorLogin, validatorCreateItem, validatorGetItem, validatorModifyItem } = require('../validators/user')
const authComercioMidleware = require('../middleware/sessionComercio')

//Creamos el router de user, gestionará todas las rutas de user
const routerUsuarios = express.Router()

// Obtener la lista de user
routerUsuarios.get('/', getItems) // Indicamos la URL y vamos al controller

// Obtener la lista de user filtrados
/**
 * @openapi
 * /api/user/filtered:
 *  get:
 *    tags:
 *    - Usuario
 *    summary: 'Obtener usuario'
 *    description: Obtener un usuario por el correo
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *      '401':
 *       description: Validation error
 *    security:
 *      - bearerAuth: []
 */
routerUsuarios.get('/filtered', authComercioMidleware, getFilterItems) // Indicamos la URL y vamos al controller

// Obtener un usuario por su correo
// Necesitamos el validador para comprobar que el correo es correcto
/**
 * @openapi
 * /api/user/:correo:
 *  get:
 *    tags:
 *    - Usuario
 *    summary: 'Obtener correos de usaurios'
 *    description: Obtener los correos de los usuarios
 *    requestBody:
 *      content:
 *        application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/obtenerUsuario'
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *      '401':
 *       description: Validation error
 *    security:
 *      - bearerAuth: []
 */
routerUsuarios.get('/:correo', validatorGetItem, getItem) // Indicamos la URL, vamos al validador y al controller

// Registrar un usuario
// Necesitamos el validador para comprobar que los datos pasados son correctos
/**
 * @openapi
 * /api/user/register:
 *  post:
 *    tags:
 *    - Usuario
 *    summary: 'Registrar usuario'
 *    description: Registrar un usuario
 *    requestBody:
 *      content:
 *        application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/user'
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *    '401':
 *       description: Validation error
 *    security:
 *      - bearerAuth: []
 */
routerUsuarios.post('/register', validatorCreateItem, createItem) // Indicamos la URL, vamos al validador y al controller

/**
 * @openapi
 * /api/user/login:
 *  post:
 *    tags:
 *    - Usuario
 *    summary: 'Loguear usuario'
 *    description: Loguear un usuario
 *    requestBody:
 *      content:
 *        application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/login'
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *    '401':
 *       description: Validation error
 *    security:
 *      - bearerAuth: []
 */
routerUsuarios.post('/login', validatorLogin, loginItem)

// Modificar un usuario a partir de su correo
// Necesitamos el validador para comprobar que los datos pasados son correctos
/**
 * @openapi
 * /api/user/:correo:
 *  patch:
 *    tags:
 *    - Usuario
 *    summary: 'Modificar usuario'
 *    description: Modificar un usuario por el correo
 *    requestBody:
 *      content:
 *        application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/modificarUsuario'
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *    '401':
 *       description: Validation error
 *    security:
 *      - bearerAuth: []
 */
routerUsuarios.patch('/:correo', validatorGetItem, validatorModifyItem, updateItem) // Indicamos la URL, vamos al validator y al controller

// Borrar un usuario a partir de su correo, y permite elegir entre un borrado lógico o físico (vía parámetro query)
// Necesitamos el validador para comprobar que el correo es correcto
/**
 * @openapi
 * /api/user/:correo:
 *  delete:
 *    tags:
 *    - Usuario
 *    summary: 'Borrar usuario'
 *    description: Borrar un usuario por el correo
 *    requestBody:
 *      content:
 *        application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/obtenerUsuario'
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *    '401':
 *       description: Validation error
 *    security:
 *      - bearerAuth: []
 */
routerUsuarios.delete('/:correo', validatorGetItem, deleteItem) // Indicamos la URL, vamos al validador y al controller

module.exports = routerUsuarios