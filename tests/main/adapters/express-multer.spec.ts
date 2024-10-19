import { ServerError } from '@/application/errors'
import { adaptMulter } from '@/main/adapters'
import multer from 'multer'
import { type NextFunction, type RequestHandler, type Request, type Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'

jest.mock('multer')

describe('adaptMulter', () => {
  let uploadSpy: jest.Mock
  let singleSpy: jest.Mock
  let multerSpy: jest.Mock
  let req: Request
  let res: Response
  let next: NextFunction
  let sut: RequestHandler

  beforeAll(() => {
    uploadSpy = jest.fn().mockImplementation((req, res, next) => {
      req.file = { buffer: Buffer.from('any_buffer'), mimetype: 'any_type' }
      next()
    })
    singleSpy = jest.fn().mockImplementation(() => uploadSpy)
    multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }))
    jest.mocked(multer).mockImplementation(multerSpy)
    req = getMockReq()
    next = getMockRes().next
  })

  beforeEach(() => {
    res = getMockRes({ locals: { anyLocals: 'any_locals' } }).res
    sut = adaptMulter
  })

  it('should call single upload with correct input', () => {
    sut(req, res, next)

    expect(multerSpy).toHaveBeenCalledWith()
    expect(multerSpy).toHaveBeenCalledTimes(1)
    expect(singleSpy).toHaveBeenCalledWith('file')
    expect(singleSpy).toHaveBeenCalledTimes(1)
    expect(uploadSpy).toBeCalledWith(req, res, expect.any(Function))
    expect(uploadSpy).toHaveBeenCalledTimes(1)
  })

  it('should returns a serverError if upload fails', () => {
    const error = new Error('multer_error')
    uploadSpy.mockImplementationOnce((req, res, next) => next(error))

    sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: new ServerError(error).message })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should not add file to res.locals', () => {
    uploadSpy.mockImplementationOnce((req, res, next) => {
      req.file = undefined
      next()
    })

    sut(req, res, next)

    expect(res.locals).toEqual({ anyLocals: 'any_locals' })
  })

  it('should add file to res.locals', () => {
    sut(req, res, next)

    expect(res.locals).toEqual({
      anyLocals: 'any_locals',
      file: {
        buffer: req.file?.buffer,
        mimeType: req.file?.mimetype
      }
    })
  })

  it('should call next on success', () => {
    sut(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(next).toHaveBeenCalledTimes(1)
  })
})
