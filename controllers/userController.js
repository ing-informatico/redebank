// Objetivo: Controladores para las rutas de usuarios
const { generarJWT } = require('../helpers/jwt');
const User = require('../models/user')
const bcrypt = require('bcrypt');




//ver todos los usuarios
const getUsers = async (req, res) => {

    try {
        const users = await User.find();
        res.json({
            ok: true,
            users,
            uid: req.uid
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

// Crear usuario
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        const salt = bcrypt.genSaltSync();
        const passwordHash = bcrypt.hashSync(password, salt);

        const newUser = new User({ name, email, password: passwordHash });

        await newUser.save();

        const token = await generarJWT(newUser.id);

        res.status(201).json({
            ok: true,
            msg: 'User Created',
            newUser: {
                name: newUser.name,
                email: newUser.email,
                password: "**************"
            },
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}



module.exports = {
    createUser,
    getUsers
}