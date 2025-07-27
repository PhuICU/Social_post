const messages = {
  errors: {
    unProcessableEntity: "Unprocessable Entity",
    register: {
      full_name: {
        required: "Tên không được để trống",
        invalid: "Tên không hợp lệ",
        min: "Tên phải lớn hơn 6 ký tự và nhỏ hơn 50 ký tự",
        max: "Tên phải nhỏ hơn 50 ký tự",
      },
      role: {
        required: "Vai trò không được để trống",
        invalid: "Vai trò không hợp lệ",
      },
      email: {
        required: "Email không được để trống",
        invalid: "Email không hợp lệ",
        exists: "Email đã tồn tại",
      },
      password: {
        required: "Mật khẩu không được để trống",
        min: "Mật khẩu phải lớn hơn 5 ký tự",
        max: "Mật khẩu phải nhỏ hơn 150 ký tự",
      },
      confirm_password: {
        required: "Xác nhận mật khẩu không được để trống",
        not_match: "Mật khẩu không trùng khớp",
      },
    },
    favorites: {
      post_id: "ID bài viết không được để trống",
      user_id: "ID người dùng không được để trống",
    },

    change_password: {
      old_password: {
        required: "Mật khẩu cũ không được để trống",
        invalid: "Mật khẩu cũ không chính xác",
        min: "Mật khẩu cũ phải lớn hơn 5 ký tự",
        max: "Mật khẩu mới phải nhỏ hơn 150 ký tự",
      },
      new_password: {
        required: "Mật khẩu mới không được để trống",
        min: "Mật khẩu mới phải lớn hơn 5 ký tự",
        max: "Mật khẩu mới phải nhỏ hơn 150 ký tự",
      },
    },
    forgot_password: {
      email: {
        required: "Email không được để trống",
        not_found: "Email không tồn tại",
        invalid: "Email không hợp lệ",
      },
    },
    unauthorized: {
      default: "Unauthorized",
      admin_required: "Bạn không có quyền thực hiện thao tác này",
      reset_password: {
        token_required: "Token reset password không được để trống",
        token_invalid: "Token reset password không hợp lệ",
        password_required: "Mật khẩu không được để trống",
        token_expired: "Token reset password đã hết hạn",
      },
      verify_email: {
        required: "Token xác thực email không được để trống",
        invalid: "Token xác thực email không hợp lệ",
        expired: "Token xác thực email đã hết hạn",
      },
      at_required: "Access token không được để trống",
      at_expired: "Access token đã hết hạn",
      at_invalid: "Access token không hợp lệ",
      rt_required: "Refresh token không được để trống",
      rt_invalid: "Refresh token không hợp lệ",
      rt_expired: "Refresh token đã hết hạn",
      rt_used_or_not_found: "Refresh token đã được sử dụng hoặc không tồn tại",
    },
    logout: {
      at_required: "Access token không được để trống",
    },
    login: {
      email: {
        required: "Email không được để trống",
        invalid: "Email không hợp lệ",
      },
      password: {
        required: "Mật khẩu không được để trống",
      },
      errors: {
        // sai thông tin đăng nhập
        invalid: "Thông tin đăng nhập không đúng",
        blocked:
          "Tài khoản của bạn đã bị khóa, vui lòng liên hệ với quản trị viên để biết thêm chi tiết",
      },
    },
  },
  success: {},
  info: {},
  warning: {},
};
export default messages;
