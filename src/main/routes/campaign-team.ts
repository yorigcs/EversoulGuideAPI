import { type Router } from 'express'

import { auth } from '@/main/middlewares'
import { adaptMulter as upload, adapterExpressController as adapt } from '@/main/adapters'
import { makeAddCampaignTeamController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.post('/campaign-upload', auth, upload, adapt(makeAddCampaignTeamController()))
}
