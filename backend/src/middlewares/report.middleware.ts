import { checkSchema } from "express-validator";
import validateSchema from "~/utils/validation";

const reportsValidator = validateSchema(
  checkSchema({
    reported_id: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Người bị báo cáo không được để trống",
      },
    },
    report_posts_id: {
      in: ["body"],
      notEmpty: {
        errorMessage: "ID báo cáo không được để trống",
      },
    },
    report_type: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Loại báo cáo không được để trống",
      },
    },
    content: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Nội dung báo cáo không được để trống",
      },
      isArray: {
        errorMessage: "Nội dung báo cáo phải là một mảng",
      },
    },
  })
);
const reportsMiddlewares = {
  reportsValidator,
};
export default reportsMiddlewares;
