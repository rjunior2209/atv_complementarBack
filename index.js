const { server } = require('./server');

const port = 8080;
server.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});