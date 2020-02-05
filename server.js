const http = require("http");
const app = require("./app")
const port = process.env.PORT || 3000;
const server = http.createServer(app);
// Listen to Server
server.listen(port, () => {
    console.debug('App listening on :' + port);
});