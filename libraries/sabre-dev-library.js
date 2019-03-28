//CUSTOM SABRE LIBRARY
const base64 = require("base-64");
const ClientOAuth2 = require("client-oauth2");
const axios = require("axios");
let retryCount = 0;

//SABRE LIBRARY CLASS CONSTRUCTOR FOR SABRE OBJECT
class SabreDev {
  constructor(sabreConfig) {
    this.sabreConfig = {
      clientId: base64.encode(sabreConfig.clientId),
      clientSecret: base64.encode(sabreConfig.clientSecret),
      restToken: sabreConfig.restToken,
      tokenTTL: "",
      clientUri: sabreConfig.clientUri
    };
  }
}

SabreDev.prototype.base64 = base64;
SabreDev.prototype.ClientOAuth2 = ClientOAuth2;
SabreDev.prototype.axios = axios;
SabreDev.prototype.axiosInstance = axiosInstance;
SabreDev.prototype.tokenInterceptor = tokenInterceptor;
SabreDev.prototype.requestSessionlessToken = requestSessionlessToken;
SabreDev.prototype.checkisTokenValid = checkisTokenValid;
SabreDev.prototype.get = get;

//GET TOKEN FROM OAUTH 2.0 SABRE (CAN PROVIDE TOKEN NEED TO ADD || TOKEN INSTEAD OF CLIENT_SECRET OR CLIENT_ID)
function requestSessionlessToken() {
  let sabreToken = new ClientOAuth2({
    clientId: this.sabreConfig.clientId,
    clientSecret: this.sabreConfig.clientSecret,
    accessTokenUri: this.sabreConfig.clientUri + "/v2/auth/token"
  });

  return sabreToken.credentials.getToken();
}
//PROMISE TO CREATE AXIOS INSTANCE, NEEDS INTERCEPTORS FOR RETRY COUNT AND RETRY WAIT ALGORITH SEE AXIOS.INSTANCE CONFIG THAT CAN BE ATTACHED AFTER INSTANCE IS CREATED
function axiosInstance(x) {
  let token = x;
  let header = axios.create({
    baseURL: this.sabreConfig.clientUri,
    timeout: 10000,
    headers: { Authorization: "Bearer " + token }
  });

  this.tokenInterceptor(header);
  return header;
}
function checkisTokenValid(TTL) {
  return Date.now() < TTL ? true : false;
}
function tokenInterceptor(instance) {
  return instance.interceptors.response.use(undefined, error => {
    return (promise = new Promise((resolve, reject) => {
      let err = {
        statusCode: error.response.status,
        message: error.response.data.message,
        status: error.response.data.status
      };
      if (error.response.status === 401 && retryCount <= 3) {
        retryCount++;
        this.requestSessionlessToken().then(
          tokenData => {
            this.sabreConfig.restToken = tokenData.accessToken;
            this.sabreConfig.tokenTTL = Date.parse(tokenData.expries);
            return resolve(this.get(error.config.url)); // need to make this one dynamic at some point (method);
          },
          error => {
            reject(error);
          }
        );
      } else {
        reject(err);
      }
    }));
  });
}
function get(uri, params = {}) {
  if (
    this.sabreConfig.restToken &&
    this.checkisTokenValid(this.sabreConfig.tokenTTL)
  ) {
    return this.axiosInstance(this.sabreConfig.restToken).get(uri, {
      params
    });
  } else {
    return this.requestSessionlessToken().then(
      x => {
        this.sabreConfig.restToken = x.accessToken;
        this.sabreConfig.tokenTTL = Date.parse(x.expires);
        return this.axiosInstance(this.sabreConfig.restToken).get(uri, {
          params
        });
      },
      error => {
        throw new Error(JSON.stringify(error));
      }
    );
  }
}

module.exports = SabreDev;
