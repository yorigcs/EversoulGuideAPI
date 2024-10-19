import { ServerError } from '@/application/errors'

import multer from 'multer'
import { type RequestHandler } from 'express'

export const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('file')
  upload(req, res, (error) => {
    if (error !== undefined) {
      return res.status(500).json({ error: new ServerError().message })
    }
    if (req.file !== undefined) {
      res.locals = { ...res.locals, file: { buffer: req.file.buffer, mimeType: req.file.mimetype } }
    }
    next()
  })
}
