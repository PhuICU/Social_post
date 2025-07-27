import { checkSchema } from "express-validator";
import validateSchema from "~/utils/validation";

/**
 title: string
  description: string
  //Thông tin giá
  price: {
    value: number
    unit: string
    is_for_sell: boolean // true: bán, false: cho thuê
    is_negotiable: boolean // có thể thương lượng
    rental_period: 'month' | 'year' | 'none'
    deposit: number // tiền cọc
  }
  // Thông tin địa chỉ
  address: AddressTypes
  // thông tin diện tích
  // thông tin về kích thước
  size: {
    width: number
    height: number
  }
  // Thông tin mặt tiền
  frontage?: number // Mặt tiền (m)
  // Thông tin đường vào
  entrance?: number // Đường vào (m)
  // Thông tin hướng
  direction: DIRECTION
  // thông tin liên hệ
  contact_info: {
    contact_name: string
    contact_phone: string
    contact_email: string
  }
  type: POST_TYPE // Loại tin đăng ví dụ: "sell" | "rent"
  // thông tin hình ảnh
  image: ImageTypes[]
  // thông tin mua bán
  buying_status: BUYING_STATUS
  // thông tin người đăng
  posted_by: string // Người đăng
  // thông tin trạng thái
  status: POST_STATUS
  // thông tin loại tin
  property_type_id: string
  view: number
  // thời gian tồn tại tin
  time_existed: number //ví dụ: 30 ngày
  // tiện ích nội ngoại khu
  number_of_bedrooms: number // Số phòng ngủ
  number_of_toilets: number // Số phòng vệ sinh
  number_of_floors: number // Số tầng
  // thông tin pháp lý
  legal_infor: string // Thông tin pháp lý (sổ đỏ, sổ hồng, giấy tờ hợp lệ)
  // thông tin nội thất
  furniture: string // Nội thất: "full" | "basic" | "none
  // tiện ích nội ngoại khu
  internal_amenities: string[]
  external_amenities: string[]
  // Ngày đăng tin
  published_at: Date
 */
const createValidator = validateSchema(
  checkSchema({
    content: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Nội dung không được để trống",
      },
      isString: {
        errorMessage: "Nội dung định dạng không hợp lệ",
      },
    },
    images: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Hình ảnh không được để trống",
      },
    },
    videos: {
      in: ["body"],
      optional: true,
      // notEmpty: {
      //   errorMessage: 'Video không được để trống'
      // }
    },
  })
);
const postsMiddlewares = {
  createValidator,
};
export default postsMiddlewares;
