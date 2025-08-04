import { checkSchema } from "express-validator";
import messages from "~/constants/message";
import validateSchema from "~/utils/validation";

const createLikeValidator = validateSchema(
  checkSchema({
    post_id: {
      in: ["body"],
      notEmpty: {
        errorMessage: messages.errors.favorites.post_id,
      },
    },
  })
);

const likeMiddlewares = {
  createLikeValidator,
};

export default likeMiddlewares;
