import { type Middleware } from '@/application/middlewares'
import { type RequestHandler } from 'express'

type Adapter = (middleware: Middleware) => RequestHandler

export const adapterExpressMiddleware: Adapter = middleware => async (req, res, next) => {
  const { cookie, ...headers } = req.headers
  let validHeaders = { ...headers }
  if (cookie !== undefined) {
    const cookiesMap = new Map<string, string>()
    cookie.split(';').forEach(cookie => {
      const [key, value] = cookie.trim().split('=')
      cookiesMap.set(key, value)
    })
    const cookies = Object.fromEntries(cookiesMap)
    validHeaders = { ...validHeaders, ...cookies }
  }

  const { data, statusCode } = await middleware.handle({ ...validHeaders })
  if (statusCode === 200) {
    const validEntries = Object.entries(data).filter(([,value]) => value)
    res.locals = { ...res.locals, ...Object.fromEntries(validEntries) }
    next()
  } else {
    res.status(statusCode).json({ error: data.message })
  }
}
