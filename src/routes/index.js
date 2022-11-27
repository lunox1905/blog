
const sharingRouter = require('./sharing');
const homeRouter = require('./home');
const managerRouter = require('./manager')

function route(app) {
    app.use('/sharing', sharingRouter);
    app.use('/manager', managerRouter);
    app.use('/', homeRouter);
}

module.exports = route;