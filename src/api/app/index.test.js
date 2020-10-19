import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { App } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, app

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  app = await App.create({})
})

test('POST /apps 201 (master)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: masterKey, provider: 'test', name: 'test', description: 'test', status: 'test', keys: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.provider).toEqual('test')
  expect(body.name).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.keys).toEqual('test')
})

test('POST /apps 401 (admin)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession })
  expect(status).toBe(401)
})

test('POST /apps 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /apps 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /apps 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /apps 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /apps 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /apps/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${app.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(app.id)
})

test('GET /apps/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${app.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /apps/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${app.id}`)
  expect(status).toBe(401)
})

test('GET /apps/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /apps/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${app.id}`)
    .send({ access_token: masterKey, provider: 'test', name: 'test', description: 'test', status: 'test', keys: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(app.id)
  expect(body.provider).toEqual('test')
  expect(body.name).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.keys).toEqual('test')
})

test('PUT /apps/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${app.id}`)
    .send({ access_token: adminSession })
  expect(status).toBe(401)
})

test('PUT /apps/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${app.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /apps/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${app.id}`)
  expect(status).toBe(401)
})

test('PUT /apps/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: masterKey, provider: 'test', name: 'test', description: 'test', status: 'test', keys: 'test' })
  expect(status).toBe(404)
})

test('DELETE /apps/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${app.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /apps/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${app.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('DELETE /apps/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${app.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /apps/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${app.id}`)
  expect(status).toBe(401)
})

test('DELETE /apps/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
