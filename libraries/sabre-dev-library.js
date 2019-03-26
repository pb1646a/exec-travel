//CUSTOM SABRE LIBRARY
const base64 = require("base-64");
const ClientOAuth2 = require("client-oauth2");
const axios = require("axios");

//SABRE LIBRARY CLASS CONSTRUCTOR FOR SABRE OBJECT
class SabreDev {
  constructor(sabreConfig) {
    this.sabreConfig = {
      clientId: base64.encode(sabreConfig.clientId),
      clientSecret: base64.encode(sabreConfig.clientSecret),
      restToken: sabreConfig.restToken,
      tokenTTL: '',
      clientUri: sabreConfig.clientUri
    };
  }
  get(uri, params = {}) {
    if (this.sabreConfig.restToken&&this.checkisTokenValid(this.sabreConfig.tokenTTL)) {
      console.log('got one already');
      return this.axiosInstance(this.sabreConfig.restToken)
        .then(obj => {
          return obj.get(uri, { params });
        })
        .catch(error => {
          throw new Error({ error: error });
        });
    } else {
      return this.requestSessionlessToken()
        .then(x => {
       
          this.sabreConfig.restToken = x.accessToken;
          this.sabreConfig.tokenTTL = Date.now() + (6 * 24 * 60 * 60 * 1000);
          return this.axiosInstance(this.sabreConfig.restToken)
            .then(obj => {
              return obj.get(uri, { params });
            })
            .catch(error => {
              throw new Error({ error: error });
            });
        })
        .catch(error => {
          throw new Error(error);
        });
    }
  }
  post(uri, data) {
    return this.requestSessionlessToken()
      .then(x =>{
        return this.axiosInstance(x)
          .then(obj => {
            return obj.post(uri, data);
          })
          .catch(error => {
            throw new Error(error);
          })
        })
      .catch(error => {
        throw new Error(error);
      });
  }
}

SabreDev.prototype.base64 = base64;
SabreDev.prototype.ClientOAuth2 = ClientOAuth2;
SabreDev.prototype.axios = axios;
SabreDev.prototype.axiosInstance = axiosInstance;
SabreDev.prototype.requestSessionlessToken = requestSessionlessToken;
SabreDev.prototype.checkisTokenValid = checkisTokenValid;

//GET TOKEN FROM OAUTH 2.0 SABRE (CAN PROVIDE TOKEN NEED TO ADD || TOKEN INSTEAD OF CLIENT_SECRET OR CLIENT_ID)
function requestSessionlessToken() {
  console.log('didnt have one before');
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
  let promise = new Promise((resolve, reject) => {
    let header = axios.create({
      baseURL: this.sabreConfig.clientUri,
      timeout: 10000,
      headers: { Authorization: "Bearer " + token }
    });
    resolve(header);
    reject(error);
  });
  return promise;
}
function checkisTokenValid(TTL){
  return Date.now()<TTL?true:false;
}

module.exports = SabreDev;
