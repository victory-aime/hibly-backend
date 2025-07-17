enum BASE_APIS_URL {
  UNSECURED = '_api/v1/unsecured',
  SECURED = '_api/v1/secure',
}

enum SWAGGER_TAGS {
  USER_MANAGEMENT = 'user-management',
}

enum APP_ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
  COLLABORATOR = 'COLLABORATOR',
  RH = 'RH',
  MANAGER = 'MANAGER',
}

export { BASE_APIS_URL, SWAGGER_TAGS, APP_ROLES };
