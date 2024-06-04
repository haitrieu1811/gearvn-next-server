export const GENERAL_MESSAGES = {
  VALIDATION_ERROR: 'Lỗi xác nhận.',
  PAGE_MUST_BE_A_POSITIVE_INTEGER: 'Page phải là số nguyên dương.',
  LIMIT_MUST_BE_A_POSITIVE_INTEGER: 'Limit phải là số nguyên dương.',
  INVALID_IMAGE_ID: 'Image id không hợp lệ.',
  PERMISSION_DENIED: 'Truy cập API bị từ chối.'
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
  PHONE_NUMBER_ALREADY_EXIST: 'Số điện thoại đã tồn tại.',
  GET_ME_SUCCESS: 'Lấy thông tin của tôi thành công.',
  GET_ALL_USERS_SUCCESS: 'Lấy tất cả người dùng trên hệ thống thành công.',
  INVALID_USER_TYPE: 'User type không hợp lệ.',
  INVALID_USER_STATUS: 'User status không hợp lệ.',
  INVALID_USER_VERIFY_STATUS: 'User verify status không hợp lệ.',
  ACCOUNT_LOCKED: 'Tài khoản đang bị khóa.',
  UNVERIFIED_USER: 'Tài khoản chưa được xác minh.',
  USER_ID_IS_REQUIRED: 'User id là bắt buộc.',
  INVALID_USER_ID: 'User id không hợp lệ.',
  USER_NOT_FOUND: 'Không tìm thấy user.',
  USER_ROLE_ALREADY_EXIST: 'User đã có quyền này.',
  USER_ROLE_NOT_EXIST: 'User không có vai trò này.',
  PHONE_NUMBER_IS_REQUIRED: 'Số điện thoại là bắt buộc.'
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

export const ROLES_MESSAGES = {
  CREATE_ROLE_SUCCESS: 'Tạo quyền mới thành công.',
  ROLE_TYPE_IS_REQUIRED: 'Role type là bắt buộc.',
  INVALID_ROLE_TYPE: 'Role type không hợp lệ.',
  ROLE_FIELD_IS_REQUIRED: 'Role field là bắt buộc.',
  INVALID_ROLE_FIELD: 'Role field là bắt buộc.',
  ROLE_NAME_IS_REQUIRED: 'Tên quyền là bắt buộc.',
  ROLE_ALREADY_EXIST: 'Quyền đã tồn tại.',
  ROLE_ID_IS_REQUIRED: 'Role id là bắt buộc.',
  INVALID_ROLE_ID: 'Role id không hợp lệ.',
  ROLE_NOT_FOUND: 'Không tìm thấy role.',
  UPDATE_ROLE_SUCCESS: 'Cập nhật role thành công.',
  GET_ALL_ROLES_SUCCESS: 'Lấy danh sách tất cả quyền thành công.',
  GET_ROLE_DETAIL_SUCCESS: 'Lấy thông tin chi tiết quyền thành công.',
  ASSIGN_ROLE_TO_USER_SUCCESS: 'Gán vai trò cho user thành công.',
  UNASSIGN_ROLE_TO_USER_SUCCESS: 'Bỏ gán vai trò của user thành công.'
} as const

export const ADDRESS_MESSAGES = {
  GET_ALL_PROVINCES_SUCCESS: 'Lấy danh sách tất cả tỉnh/thành thành công.',
  GET_DISTRICTS_SUCCESS: 'Lấy danh sách các quận/huyện thành công.',
  GET_WARDS_SUCCESS: 'Lấy danh sách các phường/xã thành công.',
  GET_STREETS_SUCCESS: 'Lấy danh sách đường thành công.',
  CREATE_ADDRESS_SUCCESS: 'Tạo địa chỉ thành công.',
  PROVINCE_ID_IS_REQUIRED: 'ID tỉnh/thành phố là bắt buộc.',
  INVALID_PROVINCE_ID: 'ID tỉnh/thành phố không hợp lệ.',
  PROVINCE_NOT_FOUND: 'Không tìm thấy tỉnh/thành phố.',
  DISTRICT_ID_IS_REQUIRED: 'ID quận/huyện là bắt buộc.',
  DISTRICT_NOT_FOUND: 'Không tìm thấy quận/huyện.',
  WARD_ID_IS_REQUIRED: 'ID phường/xã là bắt buộc.',
  WARD_NOT_FOUND: 'Không tìm thấy phường/xã.',
  ADDRESS_DETAIL_IS_REQUIRED: 'Địa chỉ chi tiết là bắt buộc.',
  ADDRESS_TYPE_IS_REQUIRED: 'Loại địa chỉ là bắt buộc.',
  INVALID_ADDRESS_TYPE: 'Loại địa chỉ không hợp lệ.',
  STREET_ID_IS_REQUIRED: 'ID đường là bắt buộc.',
  STREET_NOT_FOUND: 'Không tìm thấy đường.',
  ADDRESS_ID_IS_REQUIRED: 'ID địa chỉ là bắt buộc.',
  INVALID_ADDRESS_ID: 'ID địa chỉ không hợp lệ.',
  ADDRESS_NOT_FOUND: 'Không tìm thấy địa chỉ.',
  UPDATE_ADDRESS_SUCCESS: 'Cập nhật địa chỉ thành công.',
  SET_DEFAULT_ADDRESS_SUCCESS: 'Đặt địa chỉ thành mặc định thành công.',
  GET_MY_ADDRESSES_SUCCESS: 'Lấy địa chỉ của tôi thành công.',
  GET_ADDRESS_DETAIL_SUCCESS: 'Lấy thông tin chi tiết địa chỉ thành công.',
  DELETE_ADDRESS_SUCCESS: 'Xóa địa chỉ thành công.'
} as const

export const PRODUCT_CATEGORY_MESSAGES = {
  CREATE_PRODUCT_CATEGORY_SUCCESS: 'Tạo danh mục sản phẩm thành công.',
  PRODUCT_CATEGORY_THUMBNAIL_IS_REQUIRED: 'Ảnh đại diện danh mục sản phẩm là bắt buộc.',
  INVALID_PRODUCT_CATEGORY_THUMBNAIL: 'Ảnh đại diện sản phẩm không hợp lệ.',
  PRODUCT_CATEGORY_NAME_IS_REQUIRED: 'Tên danh mục sản phẩm là bắt buộc.',
  INVALID_PRODUCT_CATEGORY_STATUS: 'Trạng thái danh mục sản phẩm không hợp lệ.',
  ORDER_NUMBER_MUST_BE_A_POSITIVE_INTEGER: 'Số thứ tự sắp xếp danh mục sản phẩm phải là một số nguyên dương.',
  UPDATE_PRODUCT_CATEGORY_SUCCESS: 'Cập nhật danh mục sản phẩm thành công.',
  PRODUCT_CATEGORY_ID_IS_REQUIRED: 'ID danh mục sản phẩm là bắt buộc.',
  INVALID_PRODUCT_CATEGORY_ID: 'ID danh mục sản phẩm không hợp lệ.',
  PRODUCT_CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục sản phẩm.',
  GET_PRODUCT_CATEGORIES_SUCCESS: 'Lấy danh sách danh mục sản phẩm thành công.',
  GET_ALL_PRODUCT_CATEGORIES_SUCCESS: 'Lấy danh sách tất cả danh mục sản phẩm thành công.',
  GET_PRODUCT_CATEGORY_DETAIL_SUCCESS: 'Lấy thông tin chi tiết danh mục sản phẩm thành công.',
  DELETE_PRODUCT_CATEGORY_SUCCESS: 'Xóa danh mục sản phẩm thành công.',
  PRODUCT_CATEGORY_NOT_EMPTY: 'Danh mục sản phẩm đang có sản phẩm.'
} as const

export const BRANDS_MESSAGES = {
  CREATE_BRAND_SUCCESS: 'Tạo thương hiệu thành công.',
  UPDATE_BRAND_SUCCESS: 'Cập nhật thương hiệu thành công',
  DELETE_BRAND_SUCCESS: 'Xóa thương hiệu thành công.',
  BRAND_ID_IS_REQUIRED: 'ID thương hiệu là bắt buộc.',
  INVALID_BRAND_ID: 'ID thương hiệu không hợp lệ.',
  BRAND_NOT_FOUND: 'Không tìm thấy thương hiệu.',
  BRAND_THUMBNAIL_IS_REQUIRED: 'Ảnh đại diện thương hiệu là bắt buộc.',
  INVALID_BRAND_THUMBNAIL: 'Ảnh đại diện thương hiệu không hợp lệ.',
  INVALID_BRAND_STATUS: 'Trạng thái thương hiệu không hợp lệ.',
  BRAND_NAME_IS_REQUIRED: 'Tên thương hiệu là bắt buộc.',
  ORDER_NUMBER_MUST_BE_A_POSITIVE_INTEGER: 'Thứ tự sắp xếp nhãn hiệu phải là một số nguyên dương.',
  GET_ALL_BRANDS_SUCCESS: 'Lấy danh sách tất cả thương hiệu thành công.',
  GET_BRAND_DETAIL_SUCCESS: 'Lấy thông tin chi tiết thương hiệu thành công.',
  GET_BRANDS_SUCCESS: 'Lấy danh sách nhãn hiệu thành công.',
  BRAND_NOT_EMPTY: 'Thương hiệu đang có sản phẩm.'
} as const

export const PRODUCTS_MESSAGES = {
  CREATE_PRODUCT_SUCCESS: 'Tạo sản phẩm thành công.',
  PRODUCT_NAME_IS_REQUIRED: 'Tên sản phẩm là bắt buộc.',
  PRODUCT_ORIGINAL_PRICE_IS_REQUIRED: 'Giá gốc sản phẩm là bắt buộc.',
  PRODUCT_ORIGINAL_PRICE_MUST_BE_A_POSITIVE_INTEGER: 'Giá gốc sản phẩm phải là một số nguyên dương.',
  PRODUCT_PRICE_AFTER_DISCOUNT_MUST_BE_A_POSITIVE_INTEGER: 'Giá sau khi giảm phải là một số nguyên dương.',
  PRODUCT_PHOTOS_IS_REQUIRED: 'Hình ảnh sản phẩm là bắt buộc.',
  PRODUCT_PHOTOS_MUST_BE_AN_ARRAY: 'Hình ảnh sản phẩm phải là một mảng.',
  PRODUCT_PHOTOS_CAN_NOT_BE_EMPTY: 'Hình ảnh sản phẩm không được rỗng.',
  INVALID_PRODUCT_PHOTOS: 'Hình ảnh sản phẩm không hợp lệ.',
  PRODUCT_THUMBNAIL_IS_REQUIRED: 'Hình nhỏ sản phẩm là bắt buộc.',
  INVALID_PRODUCT_THUMBNAIL: 'Hình nhỏ sản phẩm không hợp lệ.',
  PRODUCT_ORDER_NUMBER_MUST_BE_A_POSITIVE_INTEGER: 'Thứ tự sắp xếp sản phẩm phải là một số nguyên dương.',
  PRODUCT_SPECIFICATIONS_MUST_BE_AN_ARRAY: 'Thông số kỹ thuật sản phẩm phải là một mảng.',
  PRODUCT_SPECIFICATIONS_CAN_NOT_BE_EMPTY: 'Thông số kỹ thuật sản phẩm không được rỗng.',
  INVALID_PRODUCT_SPECIFICATIONS: 'Thông số kỹ thuật không hợp lệ.',
  INVALID_PRODUCT_STATUS: 'Trạng thái sản phẩm không hợp lệ.',
  INVALID_PRODUCT_APPROVAL_STATUS: 'Trạng thái phê duyện sản phẩm không hợp lệ.',
  PRODUCT_ID_IS_REQUIRED: 'ID sản phẩm là bắt buộc.',
  INVALID_PRODUCT_ID: 'ID sản phẩm không hợp lệ.',
  PRODUCT_NOT_FOUND: 'Không tìm thấy sản phẩm.',
  UPDATE_PRODUCT_SUCCESS: 'Cập nhật sản phẩm thành công.',
  DELETE_PRODUCT_SUCCESS: 'Xóa sản phẩm thành công.',
  GET_PRODUCTS_SUCCESS: 'Lấy danh sách sản phẩm thành công.',
  LOWEST_PRICE_MUST_BE_AN_POSITIVE_INTEGER: 'Giá thấp nhất phải là một số nguyên dương.',
  HIGHEST_PRICE_MUST_BE_AN_POSITIVE_INTEGER: 'Giá cao nhất phải là một số nguyên dương.',
  GET_ALL_PRODUCTS_SUCCESS: 'Lấy danh sách tất cả sản phẩm thành công.',
  GET_PRODUCT_DETAIL_SUCCESS: 'Lấy thông tin chi tiết sản phẩm thành công.',
  PRODUCT_NOT_PUBLIC: 'Sản phẩm không được công khai.',
  INACTIVE_PRODUCT: 'Sản phẩm không hoạt động.'
} as const

export const REVIEWS_MESSAGES = {
  CREATE_REVIEW_SUCCESS: 'Thêm đánh giá thành công.',
  STAR_POINT_IS_REQUIRED: 'Số sao là bắt buộc.',
  INVALID_STAR_POINT: 'Số sao không hợp lệ.',
  PHOTOS_MUST_BE_AN_ARRAY_NOT_EMPTY: 'Hình ảnh đánh giá phải là một mảng không rỗng.',
  INVALID_PHOTOS: 'Hình ảnh đánh giá không hợp lệ.',
  REVIEWD_BEFORE: 'Đã đánh giá trước đó.',
  REVIEW_ID_IS_REQUIRED: 'ID review là bắt buộc.',
  INVALID_REVIEW_ID: 'ID review không hợp lệ.',
  REVIEW_NOT_FOUND: 'Không tìm thấy review.',
  REPLY_REVIEW_SUCCESS: 'Phản hồi review thành công.',
  REVIEW_REPLY_CONTENT_IS_REQUIRED: 'Nội dung phản hồi review là bắt buộc.',
  UPDATE_REVIEW_SUCCESS: 'Cập nhật review thành công.',
  GET_REVIEWS_SUCCESS: 'Lấy danh sách review thành công.',
  GET_REVIEW_DETAIL_SUCCESS: 'Lấy chi tiết review thành công.',
  GET_ALL_REVIEWS_SUCCESS: 'Lấy tất cả đánh giá có trên hệ thống thành công.',
  GET_REVIEW_REPLIES_SUCCESS: 'Lấy danh sách phản hồi review thành công.',
  DELETE_REVIEW_SUCCESS: 'Xóa review thành công.'
} as const

export const CART_ITEMS_MESSAGES = {
  ADD_PRODUCT_TO_CART_SUCCESS: 'Thêm sản phẩm vào giỏ hàng thành công.',
  UNIT_PRICE_IS_REQUIRED: 'Đơn giá sản phẩm là bắt buộc.',
  UNIT_PRICE_MUST_BE_A_POSITIVE_INT_GREATER_THAN_ZERO: 'Đơn giá sản phẩm phải là một số nguyên lớn hơn 0.',
  QUANTITY_IS_REQUIRED: 'Số lượng sản phẩm thêm vào giỏ hàng là bắt buộc.',
  QUANTITY_MUST_BE_A_POSITIVE_INT_GREATER_THAN_ZERO:
    'Số lượng sản phẩm thêm vào giỏ hàng phải là một số nguyên lớn hơn 0.',
  UPDATE_CART_ITEM_SUCCESS: 'Cập nhật giỏ hàng thành công.',
  CART_ITEM_ID_IS_REQUIRED: 'ID cart item là bắt buộc.',
  INVALID_CART_ITEM_ID: 'ID cart item không hợp lệ.',
  CART_ITEM_NOT_FOUND: 'Không tìm thấy cart item.',
  DELETE_CART_ITEM_SUCCESS: 'Xóa sản phẩm khỏi giỏ hàng thành công.',
  GET_MY_CART_SUCCESS: 'Lấy giỏ hàng của tôi thành công.',
  CHECKOUT_SUCCESS: 'Checkout thành công.',
  CART_IS_EMPTY: 'Giỏ hàng đang trống.',
  PAYMENT_METHOD_IS_REQUIRED: 'Phương thức thanh toán là bắt buộc.',
  INVALID_PAYMENT_METHOD: 'Phương thức thanh toán không hợp lệ.'
} as const

export const ORDERS_MESSAGES = {
  INVALID_ORDER_STATUS: 'Trạng thái đơn hàng không hợp lệ.',
  GET_MY_ORDERS_SUCCESS: 'Lấy danh sách đơn hàng của tôi thành công.',
  GET_ALL_ORDERS_SUCCESS: 'Lấy danh sách tất cả đơn hàng thành công.',
  UPDATE_ORDER_SUCCESS: 'Cập nhật đơn hàng thành công.',
  ORDER_IS_REQUIRED: 'ID đơn hàng là bắt buộc.',
  INVALID_ORDER_ID: 'ID đơn hàng không hợp lệ.',
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng.',
  ORDER_STATUS_IS_REQUIRED: 'Trạng thái đơn hàng là bắt buộc.',
  DELETE_ORDER_SUCCESS: 'Xóa đơn hàng thành công.'
} as const

export const POSTS_MESSAGES = {
  CREATE_POST_SUCCESS: 'Tạo bài viết thành công.',
  POST_TITLE_IS_REQUIRED: 'Tiêu đề bài viết là bắt buộc.',
  POST_CONTENT_IS_REQUIRED: 'Nội dung bài viết là bắt buộc.',
  POST_DESCRIPTION_IS_REQUIRED: 'Mô tả bài viết là bắt buộc.',
  POST_THUMBNAIL_IS_REQUIRED: 'Hình thu nhỏ bài viết là bắt buộc.',
  INVALID_POST_THUMBNAIL: 'Hình thu nhỏ bài viết không hợp lệ.',
  POST_ORDER_NUMBER_MUST_BE_AN_POSITIVE_INTEGER: 'Thứ tự sắp xếp bài viết phải là một số nguyên dương.',
  INVALID_POST_STATUS: 'Trạng thái bài viết không hợp lệ.',
  INVALID_POST_APPROVAL_STATUS: 'Trạng thái phê duyệt không hợp lệ.',
  UPDATE_POST_SUCCESS: 'Cập nhật bài viết thành công.',
  POST_ID_IS_REQUIRED: 'ID bài viết là bắt buộc.',
  INVALID_POST_ID: 'ID bài viết không hợp lệ.',
  POST_NOT_FOUND: 'Không tìm thấy bài viết.',
  DELETE_POST_SUCCESS: 'Xóa bài viết thành công.'
} as const
