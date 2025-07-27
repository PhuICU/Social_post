import { checkSchema } from "express-validator";
import validateSchema from "~/utils/validation";

const createMessageValidator = validateSchema(
  checkSchema({
    content: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Nội dung tin nhắn không được để trống",
      },
    },
    chat_id: {
      in: ["body"],
      notEmpty: {
        errorMessage: "ID chat không được để trống",
      },
    },
    user_id: {
      in: ["body"],
      notEmpty: {
        errorMessage: "ID người dùng không được để trống",
      },
    },
  })
);
