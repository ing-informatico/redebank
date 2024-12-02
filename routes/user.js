const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getUsers, createUser } = require('../controllers/userController');
const router = express.Router();

//ver todos los usuarios
router.get('/', getUsers);

// Crear usuario
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'i').withMessage('Debe ser un correo electrónico válido'),
    check('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un dígito y un carácter especial'),
        validarCampos

], createUser);


module.exports = router;