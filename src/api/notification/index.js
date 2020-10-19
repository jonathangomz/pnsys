import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import Notification, { schema } from './model'

const router = new Router({mergeParams: true})
const { appId, message, options } = schema.tree

/**
 * @api {post} /notifications Create notification
 * @apiName CreateNotification
 * @apiGroup Notification
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam message Notification's message.
 * @apiParam options Notification's options.
 * @apiSuccess {Object} notification Notification's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Notification not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true }),
  body({ appId, message, options: {} }),
  create)

/**
 * @api {get} /notifications Retrieve notifications
 * @apiName RetrieveNotifications
 * @apiGroup Notification
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} notifications List of notifications.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true }),
  query({ appId: String }),
  index)

/**
 * @api {get} /notifications/:id Retrieve notification
 * @apiName RetrieveNotification
 * @apiGroup Notification
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} notification Notification's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Notification not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /notifications/:id Update notification
 * @apiName UpdateNotification
 * @apiGroup Notification
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam message Notification's message.
 * @apiParam options Notification's options.
 * @apiSuccess {Object} notification Notification's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Notification not found.
 * @apiError 401 admin access only.
 */
router.put('/:id',
  token({ required: true }),
  update)

export { Notification, schema }
export default router
