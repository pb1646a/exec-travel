const SabreDev = require("../libraries/sabre-dev-library");
const sabre = new SabreDev({
  clientId: process.env.CLIENT_ID||'',
  clientSecret: process.env.CLIENT_SECRET||'',
  clientUri: process.env.CLIENT_URI, 
  restToken: process.env.REST_TOKEN||''

});

module.exports = sabre;
