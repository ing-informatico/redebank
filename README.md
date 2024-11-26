## El proyecto está basado en Express y utiliza JWT para la gestión de usuarios. La base de datos es MongoDB, y se puede usar MongoDB Atlas o una instalación local, integrada con Mongoose. He creado dos API: una para crear un usuario y otra para consultar los datos del usuario creado.

- Levantar con `npm run start` que tiene nodemon.
- **API para consultar los users**
    * http://localhost:3000/api/users/users


- **API para crear los users**
    * http://localhost:3000/api/users/new

- **Datos para crear un user**
    * `
        {
            "name": "nombre",
            "email": "email",
            "password": "password"   => La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un dígito y un carácter especial, pueden usar esta (La&1aurita)
        }
    `

