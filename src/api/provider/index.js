import { Router } from 'express'
import { middleware as query } from 'querymen'
import { master } from '../../services/passport'
import { index, show } from './controller'

const router = new Router()

/**
 * @api {get} /providers Retrieve provider
 * @apiName RetrieveProvider
 * @apiGroup Provider
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess {Object} provider Provider's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Provider not found.
 * @apiError 401 master access only.
 */
router.get('/',
  master(),
  query(),
  show)

export default router
