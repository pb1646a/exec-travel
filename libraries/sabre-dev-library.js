//CUSTOM SABRE LIBRARY
const base64 = require("base-64");
const ClientOAuth2 = require("client-oauth2");
const axios = require("axios");
const {BehaviorSubject} = require('rxjs');
let retryingToken=false;
let $$retryingToken = new BehaviorSubject(retryingToken);

//SABRE LIBRARY CLASS CONSTRUCTOR FOR SABRE OBJECT
class SabreDev {
  constructor(sabreConfig) {
    this.sabreConfig = {
      clientId: base64.encode(sabreConfig.clientId),
      clientSecret: base64.encode(sabreConfig.clientSecret),
      restToken: sabreConfig.restToken,
      tokenTTL: 1554301482000,
      clientUri: sabreConfig.clientUri
    };
  }
  // using error funciton to check if error can passed down or if process needs to stop and be sent to .catch()
  get(uri, params = {}) {
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
          $$retryingToken.next(false);
          return this.axiosInstance(this.sabreConfig.restToken).get(uri, {
            params
          });
        },
        error => {
          retryingToken.next(false);
          let err = "Error Getting Token";
          throw new Error(err);
        }
      );
    }
  }
}

SabreDev.prototype.base64 = base64;
SabreDev.prototype.ClientOAuth2 = ClientOAuth2;
SabreDev.prototype.axios = axios;
SabreDev.prototype.axiosInstance = axiosInstance;
SabreDev.prototype.tokenInterceptor = tokenInterceptor;
SabreDev.prototype.requestSessionlessToken = requestSessionlessToken;
SabreDev.prototype.checkisTokenValid = checkisTokenValid;

//GET TOKEN FROM OAUTH 2.0 SABRE (CAN PROVIDE TOKEN NEED TO ADD || TOKEN INSTEAD OF CLIENT_SECRET OR CLIENT_ID)
function requestSessionlessToken() {
  $$retryingToken.next(true);
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
      return promise = new Promise((resolve, reject) => {
        let err= {statusCode:error.response.status, message: error.response.data.message,status: error.response.data.status};
        if (error.response.status === 401) {
          console.log(401);
            this.requestSessionlessToken().then(
              tokenData => {
                console.log(tokenData);
                this.sabreConfig.restToken = tokenData.accessToken;
                this.sabreConfig.tokenTTL = Date.parse(tokenData.expries);
                error.config.headers.Authorization = `Bearer ${tokenData.accessToken}`;
                error.config.__isRetryRequest = true;
               //wont work becuase using axios without interceptor
               return resolve(axios(error.config));
            },
            error=>{
              let err = Error('failed to get token again');
              reject(err);
            }
  
          );

      }else{
     reject(err);
      }
    });
  });
}

module.exports = SabreDev;
