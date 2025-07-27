import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import httpStatusCode from "~/constants/httpStatusCode";
import { EntityError, ErrorWithStatus } from "~/utils/error";

const validateSchema = (validation: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validation chains
    await Promise.all(validation.map((v) => v.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const errorsObject = errors.mapped();
    const entityError = new EntityError({ errors: {} });

    for (const key in errorsObject) {
      const { msg } = errorsObject[key];

      if (
        msg instanceof ErrorWithStatus &&
        msg.status !== httpStatusCode.UNPROCESSABLE_ENTITY
      ) {
        return next(msg);
      }

      entityError.errors[key] = msg;
    }

    next(entityError);
  };
};

export default validateSchema;
