const express = require("express");
const app = express();

app.use(require("./app"));
app.use(require("./usuario"));
app.use(require("./menu"));
app.use(require("./button"));
app.use(require("./url"));
app.use(require("./slide"));
app.use(require("./imagenes"));
app.use(require("./upload"));
app.use(require("./login"));

module.exports = app;
