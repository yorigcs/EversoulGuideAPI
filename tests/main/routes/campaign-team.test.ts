import { app } from '@/main/config/app'
import prismaConnection from '@/infra/repo/prisma'
import request from 'supertest'

jest.unmock('@/infra/repo/prisma')

describe('campaign-team Routes', () => {
  const accountData = { name: 'any_name', email: 'any_mail@mail.com', password: 'any_pass', confirmPassword: 'any_pass' }
  let acessTokenResp: string

  beforeAll(async () => {
    await request(app).post('/api/sign-up').send(accountData)
    const { header } = await request(app).post('/api/sign-in').send({ email: accountData.email, password: accountData.password })
    const [acessToken] = header['set-cookie']
    acessTokenResp = acessToken.split(';')[0]
    await prismaConnection.campaignTeamStages.create({ data: { stage: '1-10' } })
  })

  afterAll(async () => {
    await prismaConnection.users.deleteMany()
    await prismaConnection.campaignTeamStages.deleteMany()
  })

  describe('POST /campaign-upload', () => {
    const validFields = { power: '123', stage: '1-10', nikkes: ['nikke1', 'nikke2'], stageType: 'normal' }
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYMj+/x8ABEMCahdmb9sAAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')

    afterAll(async () => { await prismaConnection.campaignTeam.deleteMany() })

    it('should response with status 400 and body error  with message "The field power is required"', async () => {
      const { status, body } = await request(app).post('/api/campaign-upload').send({ ...validFields, power: undefined }).set('Cookie', [acessTokenResp])

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'The field power is required' })
    })

    it('should response with status 400 and body error  with message "The field [power] must be a string."', async () => {
      const { status, body } = await request(app).post('/api/campaign-upload').send({ ...validFields, power: 123 }).set('Cookie', [acessTokenResp])

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'The field [power] must be a string.' })
    })

    it('should response with status 400 and body error  with message "The field stage is required"', async () => {
      const { status, body } = await request(app).post('/api/campaign-upload').send({ ...validFields, stage: undefined }).set('Cookie', [acessTokenResp])

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'The field stage is required' })
    })

    it('should response with status 400 and body error  with message "The field [stage] must be a string."', async () => {
      const { status, body } = await request(app).post('/api/campaign-upload').send({ ...validFields, stage: 123 }).set('Cookie', [acessTokenResp])

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'The field [stage] must be a string.' })
    })

    it('should response with status 400 and body error  with message "The field nikkes is required"', async () => {
      const { status, body } = await request(app).post('/api/campaign-upload').send({ ...validFields, nikkes: undefined }).set('Cookie', [acessTokenResp])

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'The field nikkes is required' })
    })

    it('should response with status 400 and body error  with message "The field [nikkes] must be an array."', async () => {
      const { status, body } = await request(app).post('/api/campaign-upload').send({ ...validFields, nikkes: 'nikke1' }).set('Cookie', [acessTokenResp])

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'The field [nikkes] must be an array.' })
    })

    it('should response with status 400 and body error  with message "The field file is required"', async () => {
      const { status, body } = await request(app).post('/api/campaign-upload').send({ ...validFields, file: undefined }).set('Cookie', [acessTokenResp])

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'The field file is required' })
    })

    it('should response with status 400 and body error  with message "Unsupported file. Allowed extensions: png, jpeg, jpg"', async () => {
      const { status, body } = await request(app).post('/api/campaign-upload').set('Cookie', [acessTokenResp])
        .field('power', validFields.power)
        .field('stage', validFields.stage)
        .field('nikkes', validFields.nikkes)
        .field('stageType', validFields.stageType)
        .attach('file', file, { filename: 'test.ext' })

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'Unsupported file. Allowed extensions: png, jpeg, jpg' })
    })

    it('should response with status 400 and body error with message "The field [notes] must have at least 10 characters"', async () => {
      const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYMj+/x8ABEMCahdmb9sAAAAASUVORK5CYII='
      const file = Buffer.from(onePixelImage, 'base64')
      const { status, body } = await request(app).post('/api/campaign-upload').set('Cookie', [acessTokenResp])
        .field('power', validFields.power)
        .field('stage', validFields.stage)
        .field('nikkes', validFields.nikkes)
        .field('stageType', validFields.stageType)
        .field('notes', 'small')
        .attach('file', file, { filename: 'test.png' })

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'The field [notes] must have at least 10 characters' })
    })

    it('should response with status 400 and body error with message "The field [notes] must have at least 10 characters"', async () => {
      const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYMj+/x8ABEMCahdmb9sAAAAASUVORK5CYII='
      const file = Buffer.from(onePixelImage, 'base64')
      const { status, body } = await request(app).post('/api/campaign-upload').set('Cookie', [acessTokenResp])
        .field('power', validFields.power)
        .field('stage', validFields.stage)
        .field('nikkes', validFields.nikkes)
        .field('stageType', validFields.stageType)
        .field('notes', 'A string reallly big!!,A string reallly big!!,A string reallly big!!,A string reallly big!!,A string reallly big!!A string reallly big!!,A string reallly big!!,A string reallly big!!,A string reallly big!!'
        )
        .attach('file', file, { filename: 'test.png' })

      expect(status).toBe(400)
      expect(body).toEqual({ error: 'The field [notes] must have less than 200 characters' })
    })

    it('should response with status 201 and body with message "Team uploaded!"', async () => {
      const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYMj+/x8ABEMCahdmb9sAAAAASUVORK5CYII='
      const file = Buffer.from(onePixelImage, 'base64')
      const { status, body } = await request(app).post('/api/campaign-upload').set('Cookie', [acessTokenResp])
        .field('power', validFields.power)
        .field('stage', validFields.stage)
        .field('nikkes', validFields.nikkes)
        .field('stageType', validFields.stageType)
        .attach('file', file, { filename: 'test.png' })

      expect(status).toBe(201)
      expect(body).toEqual({ message: 'Team uploaded!' })
    })
  })
})
