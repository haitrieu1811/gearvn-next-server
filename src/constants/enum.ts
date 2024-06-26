export enum HttpStatusCode {
  // 1xx Informational
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,

  // 2xx Success
  OK = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  IMUsed = 226,

  // 3xx Redirection
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,

  // 4xx Client Error
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  URITooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,

  // 5xx Server Error
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HTTPVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  VerifyEmailToken,
  ForgotPasswordToken
}

export enum RoleType {
  Create,
  Read,
  Update,
  Delete
}

export enum RoleField {
  Product,
  Post,
  Order
}

export enum UserType {
  Admin,
  Staff,
  Customer
}

export enum Gender {
  Male,
  Female,
  Other
}

export enum UserStatus {
  Active,
  Inactive
}

export enum UserVerifyStatus {
  Verified,
  Unverified
}

export enum FileType {
  Image,
  Video
}

export enum AddressType {
  Home,
  Office,
  Other
}

export enum ProductCategoryStatus {
  Active,
  Inactive
}

export enum BrandStatus {
  Active,
  Inactive
}

export enum ProductStatus {
  Active,
  Inactive
}

export enum ProductApprovalStatus {
  Approved,
  Unapproved
}

export enum OrderStatus {
  InCart,
  WaitForConfirmation,
  Confirmed,
  Delivering,
  Delivered,
  Cancelled
}

export enum PaymentMethod {
  Cash,
  Banking
}

export enum PostStatus {
  Active,
  Inactive
}

export enum PostApprovalStatus {
  Approved,
  Unapproved
}
