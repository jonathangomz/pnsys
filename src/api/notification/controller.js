import clientFactory from "../../services/pushnotifications";
import { success, notFound } from '../../services/response/'
import { Notification } from '.'
import { App } from "../app";

export const create = ({ bodymen: { body: { message, options } }, params: { appId } }, res, next) =>
  App.findById(appId)
    .then(notFound(res))
    .then(async (app) => {
      const isvalid = await app.isValid();
      if(isvalid)
        return app.getClient()
      else
        res.status(400).json({
          message: 'Invalid app'
        })
    })
    .then(async (client) => await client.sendNotification(message, options))
    .then(({ status, error, body: res_notification }) => {
      if(!error)
        return res_notification
      else
        res.status(status).json(res_notification)
    })
    .then(async (res_notification) => {
      const saved = await Notification.create({ message, options, appId, response: res_notification })
      return saved.view(true)
    })
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
