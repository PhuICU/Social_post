import { checkSchema } from "express-validator";
import validateSchema from "~/utils/validation";

const createCommentValidator = validateSchema(
  checkSchema({
    content: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Nội dung bình luận không được để trống",
      },
    },
    post_id: {
      in: ["body"],
      notEmpty: {
        errorMessage: "ID bài viết không được để trống",
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

const commentsMiddlewares = {
  createCommentValidator,
};
export default commentsMiddlewares;
