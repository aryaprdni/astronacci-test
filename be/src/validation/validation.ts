import Joi, { ObjectSchema, ValidationResult } from 'joi';
import { ResponseError } from '../error/response-error';

interface ValidateFunction {
  <T>(schema: ObjectSchema<T>, request: unknown): T;
}

const validate: ValidateFunction = <T>(schema: ObjectSchema<T>, request: unknown): T => {
  const result: ValidationResult<T> = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value as T;
  }
};

export { validate };
