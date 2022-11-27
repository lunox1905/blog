const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const route = require('./routes')
var cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
dotenv.config()
app.use(cookieParser())

const db = require('./app/config')
db.connect()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(methodOverride('_method'))
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  helpers: require('./helpers/handlebars')  
}),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'fontend', 'views'))

route(app);
app.listen(port, () => console.log(`localhost:${port}`))