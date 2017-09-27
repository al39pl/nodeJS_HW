const config = require("./config");
const models = require("./models");

console.log(config.name);

const user = new models.User;
const product = new models.Product;
