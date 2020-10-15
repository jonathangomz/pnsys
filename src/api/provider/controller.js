import { success, notFound, authorOrAdmin } from '../../services/response/'
import OSClient from "../../services/onesignal";

export const show = ({ params }, res, next) =>
  OSClient.getApp()
    .then(r => r.body)
    .then(success(res, 200))
    .catch(next)
