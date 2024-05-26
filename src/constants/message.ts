export const GENERAL_MESSAGES = {
  VALIDATION_ERROR: 'Lỗi xác nhận.',
  PAGE_MUST_BE_A_POSITIVE_INTEGER: 'Page phải là số nguyên dương.',
  LIMIT_MUST_BE_A_POSITIVE_INTEGER: 'Limit phải là số nguyên dương.',
  INVALID_IMAGE_ID: 'Image id không hợp lệ.'
} as const

export const USERS_MESSAGES = {
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công.',
  EMAIL_IS_REQUIRED: 'Email là bắt buộc.',
  INVALID_EMAIL: 'Email không hợp lệ.',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại trên hệ thống.',
  FULLNAME_IS_REQUIRED: 'Họ và tên là bắt buộc.',
  PASSWORD_IS_REQUIRED: 'Mật khẩu là bắt buộc.',
  INALID_PASSWORD_LENGHT: 'Mật khẩu phải có độ dài từ 12 đến 36 ký tự.',
  PASSWORD_IS_NOT_STRONG_ENOUGH:
    'Mật khẩu phải có tối thiểu 1 ký tự viết thường, 1 ký tự viết hoa, 1 chữ số và một ký tự đặc biệt.',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu là bắt buộc.',
  CONFIRM_PASSWORD_DO_NOT_MATCH: 'Xác nhận mật khẩu không chính xác.',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không chính xác.',
  LOGIN_SUCCESS: 'Đăng nhập thành công.',
  LOGOUT_SUCCESS: 'Đăng xuất thành công.',
  ACCESS_TOKEN_IS_REQUIRED: 'Vui lòng đăng nhập.',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token là bắt buộc.',
  REFRESH_TOKEN_DOES_NOT_EXIST: 'Refresh token không tồn tại.',
  REFRESH_TOKEN_SUCCESS: 'Refresh token thành công.',
  RESEND_EMAIL_VERIFY_SUCCESS: 'Gửi lại email xác minh thành công. Hãy kiểm tra email của bạn.',
  EMAIL_VERIFICATION_SUCCESS: 'Xác thực email thành công.',
  VERIFY_EMAIL_TOKEN_IS_REQUIRED: 'Verify email token là bắt buộc.',
  VERIFY_EMAIL_TOKEN_DOES_NOT_EXIST: 'Verify email token không tồn tại.',
  USER_VERIFIED_BEFORE: 'Người dùng đã xác thực emai trước đó.',
  EMAIL_DOES_NOT_EXIST: 'Email không tồn tại trên hệ thống.',
  FORGOT_PASSWORD_SUCCESS:
    'Chúng tôi đã gửi email đặt lại mật khẩu vào email bạn vừa nhập. Vui lòng kiểm tra và đặt lại mật khẩu.',
  RESET_PASSWORD_SUCCESS: 'Đặt lại mật khẩu thành công.',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token là bắt buộc.',
  FORGOT_PASSWORD_TOKEN_DOES_NOT_EXIST: 'Forgot password token không tồn tại.',
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công.',
  INVALID_GENDER: 'Giới tính không hợp lệ.',
  INVALID_PHONE_NUMBER: 'Số điện thoại không hợp lệ',
  UPDATE_ME_SUCCESS: 'Cập nhật tài khoản thành công.',
  PHONE_NUMBER_ALREADY_EXIST: 'Số điện thoại đã tồn tại.'
} as const

export const FILES_MESSAGES = {
  IMAGE_FILE_TYPE_INVALID: 'Loại file ảnh không hợp lệ.',
  IMAGE_FIELD_IS_REQUIRED: 'Trường image là bắt buộc.',
  UPLOAD_IMAGE_SUCCESS: 'Tải ảnh lên thành công.',
  DELETE_IMAGE_SUCCESS: 'Xóa hình ảnh thành công.',
  FILE_ID_IS_REQUIRED: 'File id là bắt buộc.',
  INVALID_FILE_ID: 'File id không hợp lệ.',
  FILE_NOT_FOUND: 'Không tìm thấy file.'
} as const
