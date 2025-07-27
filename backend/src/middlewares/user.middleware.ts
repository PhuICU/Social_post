import { checkSchema } from "express-validator";
import validateSchema from "~/utils/validation";

const updateProfileVaidator = validateSchema(
  checkSchema({
    full_name: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Tên không được để trống",
      },
    },
    phone: {
      in: ["body"],
      optional: true,
      isMobilePhone: {
        options: ["vi-VN"],
        errorMessage: "Số điện thoại không hợp lệ",
      },
    },
    email: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Email không được để trống",
      },
      isEmail: {
        errorMessage: "Email không hợp lệ",
      },
    },
    avatar: {
      in: ["body"],
      optional: true,
    },
    address: {
      in: ["body"],
      optional: true,
    },
  })
);
const usersMiddlewares = {
  updateProfileVaidator,
};
export default usersMiddlewares;
