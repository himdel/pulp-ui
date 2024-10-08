// Fool TypeScript into thinking that we actually have typings for these components.
// This will tell typescript that anything from this module is of type any.

declare module '*.png';

// Declare configuration globals here so that TypeScript compiles
/* eslint-disable no-var */
declare var API_BASE_PATH;
declare var API_HOST;
declare var APPLICATION_NAME;
declare var UI_BASE_PATH;
declare var UI_BUILD_INFO;
declare var UI_DOCS_URL;
declare var UI_EXTERNAL_LOGIN_URI;
