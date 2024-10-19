import { app } from '@/main/config/app'
import prismaConnection from '@/infra/repo/prisma'
import request from 'supertest'

jest.unmock('@/infra/repo/prisma')

type HttpRequestData = {
  email: string
  password: string
}
describe('Sign-in Routes', () => {
  describe('POST /sign-in', () => {
    let httpRequestData: HttpRequestData
    beforeAll(() => { httpRequestData = { email: 'any_mail@mail.com', password: 'any_pass' } })
    beforeEach(async () => { await prismaConnection.users.deleteMany() })

    it('should response with status 200 and body with user', async () => {
      await request(app).post('/api/sign-up').send({ name: 'any_name', email: 'any_mail@mail.com', password: 'any_pass', confirmPassword: 'any_pass' })
      const { status, body, header } = await request(app).post('/api/sign-in').send(httpRequestData)
      const [acessToken, refreshToken] = header['set-cookie']

      expect(acessToken).toBeDefined()
      expect(refreshToken).toBeDefined()

      expect(status).toBe(200)
      expect(body).toEqual({ user: { name: 'any_name', email: 'any_mail@mail.com', role: 'user', picture: expect.any(String) } })
    })

    it('should response with status 401 and body error  with message "The email or password is wrong"', async () => {
      await request(app).post('/api/sign-up').send({ name: 'any_name', email: 'any_mail@mail.com', password: 'other_pass', confirmPassword: 'any_pass' })
      const { status, body } = await request(app).post('/api/sign-in').send(httpRequestData)

      expect(status).toBe(401)
      expect(body.error).toBe('The email or password is wrong')
    })

    it('should response with status 400 and body error  with message "The field email is required"', async () => {
      const requestData = { ...httpRequestData, email: undefined }
      const { status, body } = await request(app).post('/api/sign-in').send(requestData)

      expect(status).toBe(400)
      expect(body.error).toBe('The field email is required')
    })

    it('should response with status 400 and body error  with message "This e-mail is not valid!"', async () => {
      const requestData = { ...httpRequestData, email: 'invalid_email.com' }
      const { status, body } = await request(app).post('/api/sign-in').send(requestData)

      expect(status).toBe(400)
      expect(body.error).toBe('This e-mail is not valid!')
    })

    it('should response with status 400 and body error  with message "The field password is required"', async () => {
      const requestData = { ...httpRequestData, password: undefined }
      const { status, body } = await request(app).post('/api/sign-in').send(requestData)

      expect(status).toBe(400)
      expect(body.error).toBe('The field password is required')
    })
  })
})
