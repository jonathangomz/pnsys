import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from "bodymen"
import { token } from '../../services/passport'
import { create, index, show } from './controller'
import { schema } from "../notification";

const router = new Router()
const { _id: notificationId, appId } = schema.tree;

/**
 * @api {post} /analytics Create analytic
 * @apiName CreateAnalytic
 * @apiGroup Analytic
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} analytic Analytic's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Analytic not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({
    appId, notificationId,
    event: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    }
  }),
  create)

/**
 * @api {get} /analytics Retrieve analytics
 * @apiName RetrieveAnalytics
 * @apiGroup Analytic
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} analytics List of analytics.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query({ appId: String }),
  index)

/**
 * @api {get} /analytics/:id Retrieve analytic
 * @apiName RetrieveAnalytic
 * @apiGroup Analytic
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} analytic Analytic's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Analytic not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

export default router
