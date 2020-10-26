import { success, notFound, invalidApp } from '../../services/response/'
import { getPushClient } from "../../services/pushnotifications";
import { Notification } from '.'

export const create = ({ bodymen: { body: { message, options } } }, res, next) =>
  invalidApp(res)(getPushClient())
    .then(async (client) => await client.sendNotification(message, options))
    .then(({ status, error, body }) => {
      if(error || body.errors)
        res.status(status).json(body)
      return body
    })
    .then(async (res_notification) => await Notification.create({
      _id: Notification.extractId(res_notification),
      message,
      options,
      response: res_notification
    }))
    .then((notification) => notification.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor }}, res, next) =>
  Notification.find(query, select, cursor)
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

export const cancel = ({ params }, res, next) =>
  invalidApp(res)(getPushClient())
    .then(async (client) => await client.cancelNotification(params.id))
    .then((r) => r.body.success ? Notification.findByIdAndUpdate(params.id, { canceled : true }) : null)
    .then(success(res, 204))
    .catch(next)
