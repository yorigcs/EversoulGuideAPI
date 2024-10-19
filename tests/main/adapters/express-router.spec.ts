/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/await-thenable */
import { type NextFunction, type Request, type RequestHandler, type Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, type MockProxy } from 'jest-mock-extended'

import { type Controller } from '@/application/controllers'
import { adapterExpressController } from '@/main/adapters'
import { AcessToken, RefreshToken } from '@/domain/entities'

describe('ExpressRouter', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let controller: MockProxy<Controller>
  let sut: RequestHandler

  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    controller = mock()
    controller.handle.mockResolvedValue({ statusCode: 201, data: { data: 'any_data' } })
    sut = adapterExpressController(controller)
  })

  it('should calls handle with correct request', async () => {
    await sut(req, res, next)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with correct data and statusCode 201', async () => {
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should respond with Error and statusCode 400', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error')
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should set cookies if refreshToken and acessToken are defined', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 200,
      data: { refreshToken: 'any_token', acessToken: 'any_token', other_data: 'any_data' }
    })

    await sut(req, res, next)

    expect(res.cookie).toBeCalledTimes(2)
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'any_token', { expires: expect.any(Date), maxAge: RefreshToken.expirationInMs, httpOnly: true, sameSite: 'lax' })
    expect(res.cookie).toHaveBeenCalledWith('acessToken', 'any_token', { expires: expect.any(Date), maxAge: AcessToken.expirationInMs, httpOnly: true, sameSite: 'lax' })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.status).toHaveBeenCalledTimes(1)

    expect(res.json).toHaveBeenCalledWith({ other_data: 'any_data' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
