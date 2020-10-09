import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Notification } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, notification

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  notification = await Notification.create({ sender: user })
})

test('POST /notifications 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, _os_notification_id: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body._os_notification_id).toEqual('test')
  expect(typeof body.sender).toEqual('object')
})

test('POST /notifications 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /notifications 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].sender).toEqual('object')
})

test('GET /notifications 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /notifications/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${notification.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(notification.id)
  expect(typeof body.sender).toEqual('object')
})

test('GET /notifications/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${notification.id}`)
  expect(status).toBe(401)
})

test('GET /notifications/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('DELETE /notifications/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${notification.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /notifications/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${notification.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /notifications/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${notification.id}`)
  expect(status).toBe(401)
})

test('DELETE /notifications/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
