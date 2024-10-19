import { app } from '@/main/config/app'
import prismaConnection from '@/infra/repo/prisma'
import request from 'supertest'

jest.unmock('@/infra/repo/prisma')

type HttpRequestData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}
describe('Sign-up Routes', () => {
  describe('POST /sign-up', () => {
    let httpRequestData: HttpRequestData
    beforeAll(() => { httpRequestData = { name: 'any_name', email: 'any_mail@mail.com', password: 'any_pass', confirmPassword: 'any_pass' } })
    beforeEach(async () => { await prismaConnection.users.deleteMany() })

    it('should response with status 201 and body with message "Account created!"', async () => {
      const { status, body } = await request(app).post('/api/sign-up').send(httpRequestData)

      expect(status).toBe(201)
      expect(body).toEqual({ message: 'Account created!' })
    })

    it('should response with status 409 and body error  with message "This account already exists"', async () => {
      await prismaConnection.users.create({ data: { id: '1', name: 'any_name', email: 'any_mail@mail.com', password: 'any_pass', picture: 'any_picture' } })
      const { status, body } = await request(app).post('/api/sign-up').send(httpRequestData)

      expect(status).toBe(409)
      expect(body.error).toBe('This account already exists')
    })

    it('should response with status 400 and body error  with message "The field name is required"', async () => {
      const requestData = { ...httpRequestData, name: undefined }
      const { status, body } = await request(app).post('/api/sign-up').send(requestData)

      expect(status).toBe(400)
      expect(body.error).toBe('The field name is required')
    })

    it('should response with status 400 and body error  with message "The field email is required"', async () => {
      const requestData = { ...httpRequestData, email: undefined }
      const { status, body } = await request(app).post('/api/sign-up').send(requestData)

      expect(status).toBe(400)
      expect(body.error).toBe('The field email is required')
    })

    it('should response with status 400 and body error  with message "This e-mail is not valid!"', async () => {
      const requestData = { ...httpRequestData, email: 'invalid_email.com' }
      const { status, body } = await request(app).post('/api/sign-up').send(requestData)

      expect(status).toBe(400)
      expect(body.error).toBe('This e-mail is not valid!')
    })

    it('should response with status 400 and body error  with message "The field password is required"', async () => {
      const requestData = { ...httpRequestData, password: undefined }
      const { status, body } = await request(app).post('/api/sign-up').send(requestData)

      expect(status).toBe(400)
      expect(body.error).toBe('The field password is required')
    })

    it('should response with status 400 and body error  with message "The field confirmPassword is required"', async () => {
      const requestData = { ...httpRequestData, confirmPassword: undefined }
      const { status, body } = await request(app).post('/api/sign-up').send(requestData)

      expect(status).toBe(400)
      expect(body.error).toBe('The field confirmPassword is required')
    })

    it('should response with status 400 and body error  with message "The field confirmPassword is required"', async () => {
      const requestData = { ...httpRequestData, confirmPassword: 'another_password' }
      const { status, body } = await request(app).post('/api/sign-up').send(requestData)

      expect(status).toBe(400)
      expect(body.error).toBe('The field another_password must be equals to field any_pass')
    })
  })
})
