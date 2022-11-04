const lambdaHandler = require("./app")


lambdaHandler.handler({}, {}, (args, body) => {
    console.log("CALLBACK INVOKED with", args, body)
});