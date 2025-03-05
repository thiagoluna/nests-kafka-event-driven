import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { winstonLogger } from '../../config/logger.config';

export async function validateMessage<T extends object>(
  message: any,
  dtoClass: new () => T,
  context: string = 'UnknownContext',
): Promise<{ dto: T; errorMessage?: string }> {
  const logger = winstonLogger;
  const dto = plainToInstance(dtoClass, message);
  const errors: ValidationError[] = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

  if (errors.length > 0) {
    const errorMessages = errors.flatMap((err) => {
      if (err.constraints) {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
      }
      if (err.children && err.children.length > 0) {
        return err.children.map((child) => {
          const constraints = child.constraints || {};
          return `${err.property}.${child.property} - ${Object.values(constraints).join(', ')}`;
        });
      }
      return `${err.property} - validation failed`;
    });
    const errorMessage = `Validation failed: ${errorMessages.join('; ')}`;
    logger.error(`Failed to process message in ${context}: ${errorMessage}`);
    return { dto, errorMessage };
  }

  return { dto };
}