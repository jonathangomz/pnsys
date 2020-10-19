import { success, notFound } from '../../services/response/'
import { App } from '.'

export const create = ({ bodymen: { body }, user }, res, next) =>
  App.create({ ...body, createdBy: user._id})
    .then((app) => app.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  App.find(query, { ...select, keys: 0 }, cursor)
    .then((apps) => apps.map((app) => app.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params, query: { provider } }, res, next) =>
  App.findById(params.id)
    .then(notFound(res))
    .then(async (app) => {
      if(app) {
        const view = app.view(true)
        if(provider === 'true') {
          const onProvider = await app.getClient().getApp()
          view.onProvider = onProvider.body
        }
        return view;
      }else return null
    })
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params, user }, res, next) =>
  App.findById(params.id)
    .then(notFound(res))
    .then((app) => app ? Object.assign(app, { ...body, lastUpdateBy: user._id }).save() : null)
    .then((app) => app ? app.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  App.findById(params.id)
    .then(notFound(res))
    .then((app) => app ? app.remove() : null)
    .then(success(res, 204))
    .catch(next)
