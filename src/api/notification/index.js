import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, showApp, destroy } from './controller'
import { schema } from './model'
export Notification, { schema } from './model'

const router = new Router()
const { _os_notification_id } = schema.tree

/**
 * @api {post} /notifications Create notification
 * @apiName CreateNotification
 * @apiGroup Notification
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam _os_notification_id Notification's _os_notification_id.
 * @apiSuccess {Object} notification Notification's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Notification not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ _os_notification_id }),
  create)

/**
 * @api {get} /notifications Retrieve notifications
 * @apiName RetrieveNotifications
 * @apiGroup Notification
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} notifications List of notifications.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /notifications/:id Retrieve notification
 * @apiName RetrieveNotification
 * @apiGroup Notification
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} notification Notification's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Notification not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {delete} /notifications/:id Delete notification
 * @apiName DeleteNotification
 * @apiGroup Notification
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Notification not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
