require('backend/server');
const app = require('backend/app');
const sabre_routes = require('./routes/sabre-routes')

app.use('/api/sabre', sabre_routes)