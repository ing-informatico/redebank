## El proyecto:
 `Está basado en Express y utiliza JWT para la gestión de usuarios. La base de datos es MongoDB, que puede ser utilizada a través de MongoDB Atlas o una instalación local, integrada con Mongoose. He creado dos APIs: una para crear usuarios y otra para consultar los datos de los usuarios. La base de datos ya está integrada para facilitar la gestión; solo es necesario levantar el proyecto para que funcione.`

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

