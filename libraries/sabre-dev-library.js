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
      clientUri: sabreConfig.clientUri
    }
  }
  get(uri,params={}) {
    return this.sabreAxios().then(x =>
      this.axiosInstance(x).then(obj => {return obj.get(uri,{params})}).catch(error=>{
        console.log(error);
        return error})
    ).catch(error=>{
      console.log(error);
      return error;
    });
  }
  post(uri,data){
    return this.sabreAxios().then(x =>
      this.axiosInstance(x).then(obj => {return obj.post(uri,data)}).catch(error=>{
        console.log(error);
        return error})
    ).catch(error=>{
      console.log(error);
      return error;
    });
    
  }
}

SabreDev.prototype.base64 = base64;
SabreDev.prototype.ClientOAuth2 = ClientOAuth2;
SabreDev.prototype.axios = axios;
SabreDev.prototype.axiosInstance = axiosInstance;
SabreDev.prototype.sabreAxios = sabreAxios;
//NEED TO IMPLEMENT CANCEL TOKEN SO CONCURRENT REQUESTS ARENT SENT IF PAGE RELOAD

//GET TOKEN FROM OAUTH 2.0 SABRE (CAN PROVIDE TOKEN NEED TO ADD || TOKEN INSTEAD OF CLIENT_SECRET OR CLIENT_ID)
function sabreAxios() {
  let sabreToken = new ClientOAuth2({ 
    clientId: this.sabreConfig.clientId,
    clientSecret: this.sabreConfig.clientSecret,
    accessTokenUri: this.sabreConfig.clientUri + "/v2/auth/token"
  });

  return sabreToken.credentials.getToken();
}
//PROMISE TO CREATE AXIOS INSTANCE, NEEDS INTERCEPTORS FOR RETRY COUNT AND RETRY WAIT ALGORITH SEE AXIOS.INSTANCE CONFIG THAT CAN BE ATTACHED AFTER INSTANCE IS CREATED
function axiosInstance(x) {
  let token = x.accessToken;
  let promise = new Promise((resolve, reject) => {
    let header = axios.create({
      baseURL: "https://api.test.sabre.com",
      timeout: 10000,
      headers: { Authorization: "Bearer " + token }
    });
    resolve(header);
    reject(error);
  });
  return promise;
}

module.exports = SabreDev;