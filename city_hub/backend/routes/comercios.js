// ROUTES -> comercio.js
/*
    Las routes definen cómo se accede y se interactúa con los recursos de la aplicación a través de URLs específicas, 
    y proporcionan una estructura para manejar las solicitudes HTTP entrantes de manera efectiva y coherente.

    La estructura es router.<peticion>.('URL', <middlewares>, <controlador>)
*/
// ----------------------------------------------------------------------------

// Librerias
const express = require('express')
// Módulos propios
const { getItems, getItem, getItemActivity, getItemCity, createItem, updateItem, uploadInfoItem, deleteItem, loginItem, reviewItem, createFile } = require('../controllers/comercios')
const { validatorLogin, validatorCreateItem, validatorGetItem, validatorGetItemActivity, validatorGetItemCity, validatorModifyItem, validatorUploadInfoItem, validatorUploadReviewItem } = require('../validators/comercios')
const authComercioMidleware  = require('../middleware/sessionComercio')
const authUserMiddleware = require('../middleware/sessionUser')
const uploadMiddleware = require('../utils/handleFotos')
const checkRol = require('../middleware/rol')
const checkCIF = require('../middleware/cif')

//Creamos el router de comercios, gestionará todas las rutas de comercios
const routerComercios = express.Router()

// Obtener la lista de comercios y, opcionalmente (vía parámetro query,) ordenados por el CIF ascendentemente
/**
 * @openapi
 * /api/comercios:
 *  get:
 *    tags:
 *    - Comercio
 *    summary: 'Obtener comercios'
 *    description: Obtener todos los comercios
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *      '500':
*         description: Error interno del servidor
 *    security:
 *      - bearerAuth: []
 */
routerComercios.get('/', getItems) // Indicamos la URL y vamos al controller

// Obtener un comercio por su CIF
// Necesitamos el validador para comprobar que el CIF es correcto
// El CIF lo indicamos como _CIF para no confundirlo con el nombre de CIF de la BD
/**
 * @openapi
 * /api/comercios/CIF/:_CIF:
 *   get:
 *     tags:
 *       - Comercio
 *     summary: 'Obtener comercio'
 *     description: Obtener un comercio por el CIF
 *     parameters:
 *       - in: path
 *         name: _CIF
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio a obtener
 *     responses:
 *       '200':
 *         description: Devuelve el objeto obtenido
 *       '404':
 *         description: Comercio no encontrado
 *       '500':
 *          description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
routerComercios.get('/CIF/:_CIF', validatorGetItem, getItem) // Indicamos la URL, vamos al validador y al controller

// Obtener comercios por su Actividad
// La Actividad la indicamos como _actividad para no confundirlo con el nombre de CIF de la BD
/**
 * @openapi
 * /api/comercios/CIF/:_acitivdad:
 *   get:
 *     tags:
 *       - Comercio
 *     summary: 'Obtener comercios por actividad'
 *     description: Obtener comercios por actividad
 *     parameters:
 *       - in: path
 *         name: _acitivdad
 *         required: true
 *         schema:
 *           type: string
 *         description: acitivdad de los comercios a obtener
 *     responses:
 *       '200':
 *         description: Devuelve el objeto obtenido
 *       '404':
 *         description: Comercio no encontrado
 *       '500':
 *          description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
routerComercios.get('/Actividad/:_actividad', validatorGetItemActivity, getItemActivity) // Indicamos la URL, vamos al validador y al controller

// Obtener comercios por su Ciudad
// La Ciudad la indicamos como _ciudad para no confundirlo con el nombre de ciudad de la BD
/**
 * @openapi
 * /api/comercios/CIF/:_ciudad:
 *   get:
 *     tags:
 *       - Comercio
 *     summary: 'Obtener comercios por ciudad'
 *     description: Obtener comercios por ciudad
 *     parameters:
 *       - in: path
 *         name: _ciudad
 *         required: true
 *         schema:
 *           type: string
 *         description: ciudad de los comercios a obtener
 *     responses:
 *       '200':
 *         description: Devuelve el objeto obtenido
 *       '404':
 *         description: Comercio no encontrado
 *       '500':
 *          description: Error interno del servidor
 *     security:
 *       - bearerAuth: []
 */
routerComercios.get('/Ciudad/:_ciudad', validatorGetItemCity, getItemCity) // Indicamos la URL, vamos al validador y al controller


// Registrar un comercio
// Necesitamos el validador para comprobar que los datos pasados son correctos
/**
 * @openapi
 * /api/comercios/register:
 *  post:
 *    tags:
 *    - Comercio
 *    summary: 'Registrar comercio'
 *    description: Registrar un comercio por un admin
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/registrarComercio'
 *    responses:
 *      '200':
 *        description: Returns the inserted object
 *      '401':
 *        description: Validation error
 *      '409':
 *        description: El correo o el CIF ya existen
 *      '500':
 *        description: Error interno del servidor
 *    security:
 *      - bearerAuth: []
 *  components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 */
routerComercios.post('/register', authUserMiddleware, checkRol('admin'), validatorCreateItem, createItem) // Indicamos la URL, vamos al validador y al controller

/**
 * @openapi
 * /api/comercios/login:
 *  post:
 *    tags:
 *    - Comercio
 *    summary: 'Loguear comercio'
 *    description: Loguear un comercio
 *    requestBody:
 *      content:
 *        application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/login'
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *      '401':
 *       description: Credenciales invalidos
 *      '404':
 *       description: El correo no existe
 *      '500':
 *       description: Error interno del servidor
 *    security:
 *      - bearerAuth: []
 */
routerComercios.post('/login', validatorLogin, loginItem)

// Modificar un comercio a partir de su CIF
// Necesitamos el validador para comprobar que los datos pasados son correctos
// El CIF lo indicamos como _CIF para no confundirlo con el nombre de CIF de la BD
/**
 * @openapi
 * /api/comercios/:_CIF:
 *  patch:
 *    tags:
 *    - Comercio
 *    summary: 'Modificar comercio'
 *    description: Modificar un comercio por el CIF
 *    parameters:
 *       - in: path
 *         name: _CIF
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio a modificar
 *    requestBody:
 *      content:
 *        application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/modificarComercio'
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *      '404':
 *       description: Comercio no encontrado
 *      '500':
 *       description: Error interno del servidor
 *    security:
 *      - bearerAuth: []
 */
routerComercios.patch('/:_CIF', authComercioMidleware, validatorGetItem, checkCIF, validatorModifyItem, updateItem) // Indicamos la URL, vamos al validator y al controller


// Subir informarción un comercio a partir de su CIF
// Necesitamos el validador para comprobar que los datos pasados son correctos
// El CIF lo indicamos como _CIF para no confundirlo con el nombre de CIF de la BD
/**
 * @openapi
 * /api/comercios/info/:_CIF:
 *  patch:
 *    tags:
 *    - Comercio
 *    summary: 'Subir informacion comercio'
 *    description: Subir información de un comercio por el CIF
 *    parameters:
 *       - in: path
 *         name: _CIF
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio a subir información
 *    requestBody:
 *      content:
 *        application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/infoComercio'
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *      '404':
 *       description: Comercio no encontrado
 *      '500':
 *       description: Error interno del servidor
 *    security:
 *      - bearerAuth: []
 */
routerComercios.patch('/info/:_CIF', authComercioMidleware, validatorGetItem, checkCIF, validatorUploadInfoItem, uploadInfoItem) // Indicamos la URL, vamos al validator y al controller


// Borrar un comercio a partir de su CIF, y permite elegir entre un borrado lógico o físico (vía parámetro query)
// Necesitamos el validador para comprobar que el CIF es correcto
// El CIF lo indicamos como _CIF para no confundirlo con el nombre de CIF de la BD
/**
 * @openapi
 * /api/comercios/:_CIF:
 *  delete:
 *    tags:
 *    - Comercio
 *    summary: 'Borrar comercio'
 *    description: Borrar un comercio por el CIF
 *    parameters:
 *       - in: path
 *         name: _CIF
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio a borrar
 *    requestBody:
 *      content:
 *        application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/obtenerComercio'
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *      '404':
 *       description: Comercio no encontrado
 *      '500':
 *       description: Error interno del servidor
 *    security:
 *      - bearerAuth: []
 */
routerComercios.delete('/:_CIF', authComercioMidleware, validatorGetItem, checkCIF, deleteItem) // Indicamos la URL, vamos al validador y al controller

// Subir una review un comercio a partir de su CIF
// Necesitamos el validador para comprobar que los datos pasados son correctos
// El CIF lo indicamos como _CIF para no confundirlo con el nombre de CIF de la BD
/**
 * @openapi
 * /api/comercios/review/:_CIF:
 *  patch:
 *    tags:
 *    - Comercio
 *    summary: 'Review comercio'
 *    description: Publicar una review de un comercio por el CIF
 *    parameters:
 *       - in: path
 *         name: _CIF
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio a subir review
 *    requestBody:
 *      content:
 *        application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/reviewComercio'
 *    responses:
 *      '200':
 *       description: Returns the inserted object
 *      '404':
 *       description: Comercio no encontrado
 *      '500':
 *       description: Error interno del servidor
 *    security:
 *      - bearerAuth: []
 */
routerComercios.patch('/review/:_CIF', authUserMiddleware, checkRol('user'), validatorGetItem, validatorUploadReviewItem, reviewItem) // Indicamos la URL, vamos al validator y al controller

// Subir una foto de un comercio a partir de su CIF
// Necesitamos el validador para comprobar que los datos pasados son correctos
// El CIF lo indicamos como _CIF para no confundirlo con el nombre de CIF de la BD
/**
 * @openapi
 * /api/comercios/fotos/:_CIF:
 *  post:
 *    tags:
 *    - Comercio
 *    summary: 'Foto comercio'
 *    description: Subir una foto de un comercio por su CIF
 *    parameters:
 *       - in: path
 *         name: _CIF
 *         required: true
 *         schema:
 *           type: string
 *         description: CIF del comercio para subir la foto
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              image:
 *                type: string
 *                format: binary
 *    responses:
 *      '200':
 *       description: Foto subida exitosamente
 *      '400':
 *       description: La foto no fue proporcionada o es inválida
 *      '404':
 *       description: Comercio no encontrado
 *      '500':
 *       description: Error interno del servidor
 *    security:
 *      - bearerAuth: []
 */
routerComercios.post('/fotos/:_CIF', authComercioMidleware, validatorGetItem, checkCIF,  uploadMiddleware.single('image'), createFile) // Indicamos la URL, vamos al validator y al controller

module.exports = routerComercios