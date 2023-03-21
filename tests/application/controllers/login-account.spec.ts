import { Controller } from '@/application/controllers'
import { LoginAccount, Output as Response } from '@/domain/use-cases'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { UnauthorizedError } from '@/application/errors'
import { Validator, ValidationBuild as Builder, EmailValidator, RequiredStringValidator } from '@/application/validations'

type HttpRequest = { email: string, password: string }
type Model = Error | Response
class LoginAccountController extends Controller {
  constructor (private readonly loginAccount: LoginAccount) {
    super()
  }

  async perform ({ email, password }: HttpRequest): Promise<HttpResponse<Model>> {
    const user = await this.loginAccount({ email, password })
    if (user === null) return unauthorized('The email or password is wrong')
    return ok(user)
  }

  override buildValidators ({ email, password }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ fieldName: 'email', value: email }).email().required().build(),
      ...Builder.of({ fieldName: 'password', value: password }).required().build()
    ]
  }
}

describe('LoginAccountController', () => {
  const httpRequest = { email: 'any@email.com', password: 'any_password' }
  const data = {
    user: { name: 'any_name', email: 'any@email.com', picture: 'any_picture', role: 'user' },
    acessToken: 'any_token',
    refreshToken: 'any_token'
  }

  let sut: LoginAccountController
  let loginAccount: jest.Mock

  beforeAll(() => {
    loginAccount = jest.fn()
    loginAccount.mockReturnValue(data)
  })
  beforeEach(() => { sut = new LoginAccountController(loginAccount) })

  it('should extends controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should build valitors correctly', async () => {
    const validators = sut.buildValidators(httpRequest)
    expect(validators).toEqual([
      new EmailValidator('any@email.com'),
      new RequiredStringValidator('email', 'any@email.com'),
      new RequiredStringValidator('password', 'any_password')
    ])
  })

  it('should calls loginAccount with correct input', async () => {
    await sut.handle(httpRequest)
    expect(loginAccount).toHaveBeenCalledTimes(1)
    expect(loginAccount).toHaveBeenCalledWith(httpRequest)
  })

  it('should returns status code 401 and body with error message if password or email is wrong', async () => {
    loginAccount.mockReturnValueOnce(null)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({ statusCode: 401, data: new UnauthorizedError('The email or password is wrong') })
  })

  it('should returns status code 200 and body with data', async () => {
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({ statusCode: 200, data })
  })
})
