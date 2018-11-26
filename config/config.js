module.exports.SEED = "asdgasdqwevadd-op!!!-preubacod123213213";

//PUERTO
process.env.PORT = process.env.PORT || 3000;


//ENTORNO

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//BASE DE DATOS
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/ikusi'
} else {
    urlDB = "mongodb://ikusi-admin:wmso7sMfpA@ds241723.mlab.com:41723/ikusi";
}

process.env.URLDB = urlDB;