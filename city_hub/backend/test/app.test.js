const request = require('supertest')
const app = require('../app')

describe('comercio', () => {

    var token = ''
    var id = ''
    var token2 = ''
    var id2 = ''
    var tokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjJkNDRjMjEwMTM0Yjk0ZGRiZTQ0N2MiLCJyb2wiOlsiYWRtaW4iXSwiaWF0IjoxNzE0Mjk3MDg0LCJleHAiOjE3NDU4NTQ2ODR9.dKRTE0oI6xW49u5l4qBIoOwyJtEQwyWJA7krgIuqVBM'

    // Test para registrar un comercio
    it('should register a commerce', async () => {
        const response = await request(app)
            .post('/api/comercios/register')
            .auth(tokenAdmin, { type: 'bearer' })
            .send({
                'nombre': 'Comercio',
                'CIF': 'A98765432',
                'direccion': 'Avenida del Comercio, 123',
                'correo': 'comercio@test.com',
                'password': 'Comercio123',
                'telefono': 987654320 })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.comercio.nombre).toEqual('Comercio')
        expect(response.body.comercio.correo).toEqual('comercio@test.com')

    })

    // Test para registrar un comercio
    it('should register a commerce', async () => {
        const response = await request(app)
            .post('/api/comercios/register')
            .auth(tokenAdmin, { type: 'bearer' })
            .send({
                'nombre': 'Comercio2',
                'CIF': 'S98765432',
                'direccion': 'Avenida del Comercio, 123',
                'correo': 'comercio2@test.com',
                'password': 'Comercio123',
                'telefono': 987654320 })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.comercio.nombre).toEqual('Comercio2')
        expect(response.body.comercio.correo).toEqual('comercio2@test.com')

    })

    // Test para registrar un comercio sin permisos (no esta el token de admin)
    it('should get a Unauthorized error', async () => {
        const response = await request(app)
            .post('/api/comercios/register')
            .send({
                'nombre': 'Comercio',
                'CIF': 'A98765432',
                'direccion': 'Avenida del Comercio, 123',
                'correo': 'comercio@test.com',
                'password': 'Comercio123',
                'telefono': 987654320 })
            .set('Accept', 'application/json')
            .expect(401)
    })

    // Test para logear un comercio
    it('should login a commerce', async () => {
        const response = await request(app)
            .post('/api/comercios/login')
            .auth(token, { type: 'bearer' })
            .send({
                'correo': 'comercio@test.com',
                'password': 'Comercio123' })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.comercio.nombre).toEqual('Comercio')
        expect(response.body.comercio.correo).toEqual('comercio@test.com')

        token = response.body.token
        id = response.body.comercio.CIF
    })

    // Test para logear un comercio
    it('should login a commerce', async () => {
        const response = await request(app)
            .post('/api/comercios/login')
            .auth(token, { type: 'bearer' })
            .send({
                'correo': 'comercio2@test.com',
                'password': 'Comercio123' })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.comercio.nombre).toEqual('Comercio2')
        expect(response.body.comercio.correo).toEqual('comercio2@test.com')

        token2 = response.body.token
        id2 = response.body.comercio.CIF
    })

    // Test para logear un comercio con credenciales invalidas (la contraseña es incorrecta)
    it('should login a commerce with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/comercios/login')
            .auth(token, { type: 'bearer' })
            .send({
                'correo': 'comercio@test.com',
                'password': 'Comercio' })
            .set('Accept', 'application/json')
            .expect(401)
    })

    // Test para logear un comercio con un correo que no existe
    it('should login a commerce with unregistered email', async () => {
        const response = await request(app)
            .post('/api/comercios/login')
            .auth({ type: 'bearer' })
            .send({
                'correo': 'comercio3@test.com',
                'password': 'Comercio' })
            .set('Accept', 'application/json')
            .expect(404)
    })

    // Test para modificar un comercio
    it('should update a commerce', async () => {
        const response = await request(app)
            .patch(`/api/comercios/${id}`)
            .auth(token, { type: 'bearer' })
            .send({
                'direccion': 'Avenida del Comercio, 123',
                'telefono': 987654320 })
            .set('Accept', 'application/json')
            .expect(200)
    })

    // Test para modificar un comercio sin token
    it('should update a commerce without token', async () => {
        const response = await request(app)
            .patch(`/api/comercios/${id}`)
            .auth({ type: 'bearer' })
            .send({
                'direccion': 'Avenida del Comercio, 123',
                'telefono': 987654320 })
            .set('Accept', 'application/json')
            .expect(401)
    })

    // Test para modificar un comercio sin permisos
    it('shouldn`t update a commerce due to lack of permissions', async () => {
        const response = await request(app)
            .patch(`/api/comercios/A123456789`)
            .auth(token, { type: 'bearer' })
            .send({
                'direccion': 'Avenida del Comercio, 123',
                'telefono': 987654320 })
            .set('Accept', 'application/json')
            .expect(403)
    })

    // Test para obtener los comercios
    it('should get the commerce', async () => {
        const response = await request(app)
            .get('/api/comercios/')
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.pop().nombre).toEqual('Comercio2')
    })

    // Test para borrar un comercio de forma lógica
    it('should delete a commerce using a logical delete', async () => {
        const response = await request(app)
            .delete(`/api/comercios/${id}`)
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.acknowledged).toEqual(true)
    })

    // Test para borrar un comercio de forma lógica sin permisos
    it('should delete a commerce using a logical delete without permissions', async () => {
        const response = await request(app)
            .delete(`/api/comercios/A123456789`)
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(403)
    })

    // Test para borrar un comercio de forma física
    it('should delete a commerce using a physical delete', async () => {
        const response = await request(app)
            .delete(`/api/comercios/admin/${id2}`)
            .auth(tokenAdmin, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.acknowledged).toEqual(true)
    })

})

describe('Usuario', () => {
    let token = ''
    let id = ''
    const tokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjJkNDRjMjEwMTM0Yjk0ZGRiZTQ0N2MiLCJyb2wiOlsiYWRtaW4iXSwiaWF0IjoxNzE0Mjk3MDg0LCJleHAiOjE3NDU4NTQ2ODR9.dKRTE0oI6xW49u5l4qBIoOwyJtEQwyWJA7krgIuqVBM'

    // Test para registrar un usuario
    it('debería registrar un usuario', async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send({
                nombre: 'Usuario1',
                correo: 'usuario1@test.com',
                password: 'Usuario123',
                edad: 25,
                ciudad: 'Barcelona',
                intereses: ['Tecnología', 'Viajes'],
                ofertas: true
            })
            .set('Accept', 'application/json')
            .expect(200)

        expect(response.body.usuario.nombre).toEqual('Usuario1')
        expect(response.body.usuario.correo).toEqual('usuario1@test.com')

        token = response.body.token
        id = response.body.usuario.correo
    })

    // Test para iniciar sesión de usuario
    it('debería iniciar sesión de usuario', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .auth(token, { type: 'bearer' })
            .send({
                correo: 'usuario1@test.com',
                password: 'Usuario123'
            })
            .set('Accept', 'application/json')
            .expect(200)

        expect(response.body.usuario.nombre).toEqual('Usuario1')
        expect(response.body.usuario.correo).toEqual('usuario1@test.com')

        token = response.body.token
        id = response.body.usuario.correo
    })

    // Test para iniciar sesión de usuario con un correo que no existe
    it('debería iniciar sesión de usuario cuyo correo no existe', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .auth(token, { type: 'bearer' })
            .send({
                correo: 'usuario@test.com',
                password: 'Usuario'
            })
            .set('Accept', 'application/json')
            .expect(404)
    })

    // Test para iniciar sesión de usuario con credenciales inválidas
    it('debería iniciar sesión de usuario con credenciales invalidos', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .auth(token, { type: 'bearer' })
            .send({
                correo: 'usuario1@test.com',
                password: 'Usuario'
            })
            .set('Accept', 'application/json')
            .expect(401)
    })

    // Test para modificar usuario
    it('debería actualizar usuario', async () => {
        const response = await request(app)
            .patch(`/api/user/${id}`)
            .auth(token, { type: 'bearer' })
            .send({
                ciudad: 'Madrid'
            })
            .set('Accept', 'application/json')
            .expect(200)
    })

    // Test para modificar usuario sin permisos
    it('no debería actualizar usuario debido a los permisos', async () => {
        const response = await request(app)
            .patch(`/api/user/A123456789`)
            .auth(token, { type: 'bearer' })
            .send({
                ciudad: 'Madrid'
            })
            .set('Accept', 'application/json')
            .expect(403)
    })

    // Test para obtener usuarios
    it('debería obtener usuarios', async () => {
        const response = await request(app)
            .get('/api/user/')
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.pop().nombre).toEqual('Usuario1')
    })

    // Test para borrar usuario
    it('debería eliminar usuario', async () => {
        const response = await request(app)
            .delete(`/api/user/${id}`)
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(200)
    })
})