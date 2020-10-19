import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Notification } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, notification

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  notification = await Notification.create({})
})

test('POST /notifications 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, message: 'test', options: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.message).toEqual('test')
  expect(body.options).toEqual('test')
})

test('POST /notifications 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /notifications 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /notifications 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /notifications 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /notifications 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /notifications/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${notification.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(notification.id)
})

test('GET /notifications/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${notification.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /notifications/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${notification.id}`)
  expect(status).toBe(401)
})

test('GET /notifications/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /notifications/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${notification.id}`)
    .send({ access_token: adminSession, message: 'test', options: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(notification.id)
  expect(body.message).toEqual('test')
  expect(body.options).toEqual('test')
})

test('PUT /notifications/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${notification.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /notifications/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${notification.id}`)
  expect(status).toBe(401)
})

test('PUT /notifications/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, message: 'test', options: 'test' })
  expect(status).toBe(404)
})

test('DELETE /notifications/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${notification.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /notifications/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${notification.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /notifications/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${notification.id}`)
  expect(status).toBe(401)
})

test('DELETE /notifications/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
