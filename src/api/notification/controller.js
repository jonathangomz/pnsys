import { success, notFound } from '../../services/response/'
import { Notification } from '.'

export const create = ({ bodymen: { body }, params: { appId } }, res, next) =>
  Notification.create({ ...body, appId })
  .then((notification) => notification.view(true))
  .then(success(res, 201))
  .catch(next)

export const index = ({ querymen: { query, select, cursor }, params: { appId } }, res, next) =>
  Notification.find({...query, appId}, select, cursor)
  .then((notifications) => notifications.map((notification) => notification.view()))
  .then(success(res))
  .catch(next)

export const show = ({ params }, res, next) =>
  Notification.findById(params.id)
    .then(notFound(res))
    .then((notification) => notification ? notification.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Notification.findById(params.id)
    .then(notFound(res))
    .then((notification) => notification ? Object.assign(notification, body).save() : null)
    .then((notification) => notification ? notification.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Notification.findById(params.id)
    .then(notFound(res))
    .then((notification) => notification ? notification.remove() : null)
    .then(success(res, 204))
    .catch(next)
