import { RequiredStringValidator, RequiredValidator, RequiredArrayValidator, RequiredBufferValidator } from '@/application/validations'
import { RequiredFieldError } from '@/application/errors'

describe('Required', () => {
  describe('RequiredValidator', () => {
    it('should returns a RequiredFieldError if value is null', () => {
      const sut = new RequiredValidator(null, 'any_fieldname')

      const error = sut.validate()
      expect(error).toEqual(new RequiredFieldError('any_fieldname'))
    })

    it('should returns a RequiredFieldError if value is undefined', () => {
      const sut = new RequiredValidator(undefined, 'any_fieldname')

      const error = sut.validate()
      expect(error).toEqual(new RequiredFieldError('any_fieldname'))
    })

    it('should returns RequiredFieldError without fieldname if it is not provided', () => {
      const sut = new RequiredValidator(null)

      const error = sut.validate()
      expect(error).toEqual(new RequiredFieldError(undefined))
    })

    it('should returns undefined if field has a valid value', () => {
      const sut = new RequiredValidator('any_value', 'any_fieldname')

      const error = sut.validate()

      expect(error).toBeUndefined()
    })
  })

  describe('RequiredStringValidator', () => {
    it('should be instance of RequiredFieldError', () => {
      const sut = new RequiredStringValidator('any_fieldname', 'any_value')

      expect(sut).toBeInstanceOf(RequiredValidator)
    })

    it('should returns RequiredFieldError if value length is zero', () => {
      const sut = new RequiredStringValidator('any_fieldname', '')

      const error = sut.validate()

      expect(error).toEqual(new RequiredFieldError('any_fieldname'))
    })
  })

  describe('RequiredArrayValidator', () => {
    it('should be instance of RequiredFieldError', () => {
      const sut = new RequiredArrayValidator('any_fieldname', ['any_value'])

      expect(sut).toBeInstanceOf(RequiredValidator)
    })

    it('should returns RequiredFieldError if value length is zero', () => {
      const sut = new RequiredArrayValidator('any_fieldname', [])

      const error = sut.validate()

      expect(error).toEqual(new RequiredFieldError('any_fieldname'))
    })
  })

  describe('RequiredBufferValidator', () => {
    it('should be instance of RequiredFieldError', () => {
      const sut = new RequiredBufferValidator('any_fieldname', Buffer.from('any_buffer'))

      expect(sut).toBeInstanceOf(RequiredValidator)
    })
    it('should returns RequiredFieldError if value length is zero', () => {
      const sut = new RequiredBufferValidator('any_fieldname', Buffer.from(''))

      const error = sut.validate()
      expect(error).toEqual(new RequiredFieldError('any_fieldname'))
    })

    it('should returns undefined if buffer is a valid value', () => {
      const sut = new RequiredBufferValidator('any_fieldname', Buffer.from('any_buffer'))

      const error = sut.validate()

      expect(error).toBeUndefined()
    })
  })
})