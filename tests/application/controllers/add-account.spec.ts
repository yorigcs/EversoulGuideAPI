
import { AddAccountController } from '@/application/controllers'
import { AddAccountService } from '@/data/services'
import { MockProxy, mock } from 'jest-mock-extended'
import { ConflictError } from '@/application/errors'
import { RequiredStringValidator, CompareStringValidator } from '@/application/validations'

jest.mock('@/application/validations/required-string')
jest.mock('@/application/validations/compare-string')

describe('AddAccountController', () => {
  let httpRequest: any
  let sut: AddAccountController
  let addAccountService: MockProxy<AddAccountService>

  beforeAll(() => {
    addAccountService = mock()
    addAccountService.perform.mockResolvedValue(true)
  })
  beforeEach(() => {
    httpRequest = { name: 'any_name', email: 'any_email', password: 'any_password', confirmPassword: 'any_password' }
    sut = new AddAccountController(addAccountService)
  })

  it('should returns 400 if RequiredStringValidator fails', async () => {
    const error = new Error('validation_error')
    const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest.mocked(RequiredStringValidator).mockImplementationOnce(RequiredStringValidatorSpy)

    const httpResponse = await sut.handle(httpRequest)
    expect(RequiredStringValidator).toHaveBeenCalledWith('name', 'any_name')
    expect(RequiredStringValidator).toHaveBeenCalledTimes(1)
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  it('should returns status code 400 if CompareStringValidator fails', async () => {
    const error = new Error('validation_error')
    const CompareStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest.mocked(CompareStringValidator).mockImplementationOnce(CompareStringValidatorSpy)

    const httpResponse = await sut.handle(httpRequest)
    expect(CompareStringValidator).toHaveBeenCalledWith('any_password', 'any_password')
    expect(CompareStringValidator).toHaveBeenCalledTimes(1)
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
  })

  it('should returns status code 409 if perform to add addAcount returns false', async () => {
    addAccountService.perform.mockResolvedValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({ statusCode: 409, data: new ConflictError('This account already exists') })
  })

  it('should returns status code 200 if perform to add addAcount returns true', async () => {
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({ statusCode: 200, data: 'Account created successfully' })
  })

  it('should returns status code 500 if perform to add addAcount throws', async () => {
    addAccountService.perform.mockRejectedValueOnce(new Error('Infra error'))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({ statusCode: 500, data: new Error('An internal error occured, try again later!') })
  })
})