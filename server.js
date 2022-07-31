// Import
const { request, response } = require('express');
const express = require('express');
const apiRouter = require('./route/apiRouter').router;

// Instanciation server
const server = express();

// body parsing via express
server.use(express.urlencoded({extended: true}));
server.use(express.json());

//config routes
server.get('/', (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    response.status(200).send('Salut les connards')
});

server.use('/api', apiRouter);

//Listener
server.listen(8020, () => {
    console.log('Server On')
})