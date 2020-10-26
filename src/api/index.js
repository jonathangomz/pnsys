import { Router } from 'express'
import notification from './notification'
import analytic from './analytic'

const router = new Router()

/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */
router.use('/notifications', notification)
router.use('/analytics', analytic)

export default router
