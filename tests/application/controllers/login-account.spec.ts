import { Controller } from '@/application/controllers'
import { LoginAccount } from '@/domain/use-cases'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { UnauthorizedError } from '@/application/errors'

type HttpRequest = { email: string, password: string }
class LoginAccountController extends Controller {
  constructor (private readonly loginAccount: LoginAccount) {
    super()
  }

  async perform ({ email, password }: HttpRequest): Promise<HttpResponse<any>> {
    const user = await this.loginAccount({ email, password })
    if (user === null) return unauthorized('The email or password is wrong')
    return ok(user)
  }
}

describe('LoginAccountController', () => {
  const data = {
    user: { name: 'any_name', email: 'any@mail', picture: 'any_picture', role: 'user' },
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

  it('should calls loginAccount with correct input', async () => {
    await sut.perform({ email: 'any@mail', password: 'any_password' })
    expect(loginAccount).toHaveBeenCalledTimes(1)
    expect(loginAccount).toHaveBeenCalledWith({ email: 'any@mail', password: 'any_password' })
  })

  it('should returns status code 401 and body with error message if password or email is wrong', async () => {
    loginAccount.mockReturnValueOnce(null)
    const httpResponse = await sut.handle({ email: 'any@mail', password: 'any_password' })
    expect(httpResponse).toEqual({ statusCode: 401, data: new UnauthorizedError('The email or password is wrong') })
  })

  it('should returns status code 200 and body with data', async () => {
    const httpResponse = await sut.handle({ email: 'any@mail', password: 'any_password' })
    expect(httpResponse).toEqual({ statusCode: 200, data })
  })
})
