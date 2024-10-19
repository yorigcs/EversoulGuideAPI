import { adapterExpressMiddleware } from '@/main/adapters'
import { makeAuthenticationMiddleware } from '@/main/factories/middlewares'

export const auth = adapterExpressMiddleware(makeAuthenticationMiddleware())
