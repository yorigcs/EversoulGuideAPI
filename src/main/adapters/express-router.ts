import { type Controller } from '@/application/controllers'
import { AcessToken, RefreshToken } from '@/domain/entities'
import { type RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

const adapterExpressController: Adapter = controller => async (req, res) => {
  const { statusCode, data } = await controller.handle({ ...req.body, ...res.locals })
  const { acessToken, refreshToken, ...bodyData } = data
  if (acessToken !== undefined && refreshToken !== undefined) {
    res.cookie('acessToken', acessToken, { expires: new Date(Date.now() + AcessToken.expirationInMs), maxAge: AcessToken.expirationInMs, httpOnly: true, sameSite: 'lax' })
    res.cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + RefreshToken.expirationInMs), maxAge: RefreshToken.expirationInMs, httpOnly: true, sameSite: 'lax' })
  }
  const json = [200, 201].includes(statusCode) ? bodyData : { error: data.message }
  res.status(statusCode).json(json)
}

export { adapterExpressController }
