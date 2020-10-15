import { success, notFound } from '../../services/response/'
import { App } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  App.create(body)
    .then((app) => app.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  App.find(query, select, cursor)
    .then((apps) => apps.map((app) => app.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  App.findById(params.id)
    .then(notFound(res))
    .then((app) => app ? app.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  App.findById(params.id)
    .then(notFound(res))
    .then((app) => app ? Object.assign(app, body).save() : null)
    .then((app) => app ? app.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  App.findById(params.id)
    .then(notFound(res))
    .then((app) => app ? app.remove() : null)
    .then(success(res, 204))
    .catch(next)
