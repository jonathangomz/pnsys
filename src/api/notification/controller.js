import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Notification } from '.'
import OSClient from "../../services/onesignal";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Notification.create({ ...body, sender: user })
    .then((notification) => notification.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Notification.find(query, select, cursor)
    .populate('sender')
    .then((notifications) => notifications.map((notification) => notification.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Notification.findById(params.id)
    .populate('sender')
    .then(notFound(res))
    .then((notification) => notification ? notification.view() : null)
    .then(success(res))
    .catch(next)

export const showApp = ({ params }, res, next) =>
  OSClient.getApp()
    .then(r => r.body)
    .then(success(res, 200))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Notification.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'sender'))
    .then((notification) => notification ? notification.remove() : null)
    .then(success(res, 204))
    .catch(next)
