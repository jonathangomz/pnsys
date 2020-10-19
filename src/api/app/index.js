import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master, token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import App, { schema } from './model'

const router = new Router()
const { provider, name, description, status, keys } = schema.tree

/**
 * @api {post} /apps Create app
 * @apiName CreateApp
 * @apiGroup App
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam provider App's provider.
 * @apiParam name App's name.
 * @apiParam description App's description.
 * @apiParam status App's status.
 * @apiParam keys App's keys.
 * @apiSuccess {Object} app App's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 App not found.
 * @apiError 401 master access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({ provider, name, description, status, keys: {} }),
  create)

/**
 * @api {get} /apps Retrieve apps
 * @apiName RetrieveApps
 * @apiGroup App
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} apps List of apps.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

/**
 * @api {get} /apps/:id Retrieve app
 * @apiName RetrieveApp
 * @apiGroup App
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} app App's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 App not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  show)

/**
 * @api {put} /apps/:id Update app
 * @apiName UpdateApp
 * @apiGroup App
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam provider App's provider.
 * @apiParam name App's name.
 * @apiParam description App's description.
 * @apiParam status App's status.
 * @apiParam keys App's keys.
 * @apiSuccess {Object} app App's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 App not found.
 * @apiError 401 master access only.
 */
router.put('/:id',
  token({ required: true, roles: ['admin'] }),
  body({ name, description, status, keys: {} }),
  update)

/**
 * @api {delete} /apps/:id Delete app
 * @apiName DeleteApp
 * @apiGroup App
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 App not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export { App, schema }
export default router
