
const express = require('express');
const cors = require('cors');
const app = express();
const { db } = require('../db/config');

class Server {


    constructor() {
        this.app = express();
        this.port = process.env.PORT;


        //Conectar a base de datos
        this.dbConnection();
        //Middelwares
        this.middelwares();
        //Routes
        this.routes();
        //Listen
        this.listen();
    }

    //Conectar a base de datos
    async dbConnection() {
        await db();
    }


    //Middelwares
    middelwares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }

    //Routes
    routes() {
        this.app.use('/api/users', require('../routes/user'));
    }


    //Listebes
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        });
    }
}


module.exports = Server;