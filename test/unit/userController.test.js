// Importar módulos necesarios para realizar pruebas
import request from "supertest"; // Librería para realizar solicitudes HTTP en pruebas
import express from "express"; // Framework para crear servidor web
import { createUser, getUsers } from "../../controllers/userController"; // Importar controladores a probar
import User from "../../models/user"; // Importar modelo de Usuario
import bcrypt from "bcrypt"; // Librería para hashear contraseñas
import { generarJWT } from "../../helpers/jwt"; // Importar función para generar tokens

// Crear mocks (simulaciones) de las dependencias externas
jest.mock("../../models/user"); // Mockear el modelo de Usuario
jest.mock("../../helpers/jwt", () => ({
  // Mockear la generación de JWT (JSON Web Token)
  generarJWT: jest.fn().mockResolvedValue("mock-token"),
}));
jest.mock("bcrypt"); // Mockear bcrypt para controlar el hasheo de contraseñas

// Configurar una aplicación Express para pruebas
const app = express();
app.use(express.json()); // Middleware para parsear JSON en las solicitudes
app.get("/users", getUsers); // Registrar ruta GET para obtener usuarios
app.post("/users", createUser); // Registrar ruta POST para crear usuarios

// Grupo de pruebas para la ruta GET de usuarios
describe("GET /users", () => {
  // Prueba para obtener todos los usuarios
  it("should return all users", async () => {
    // Crear un arreglo de usuarios simulados
    const mockUsers = [
      { email: "jh@hotmail.com", name: "John", password: "123456" },
      { email: "jane@hotmail.com", name: "Jane", password: "123456" },
      { email: "jd@hotmail.com", name: "Doe", password: "123456" },
    ];

    // Configurar el mock de User.find para devolver los usuarios simulados
    User.find.mockResolvedValue(mockUsers);

    // Realizar una solicitud GET a la ruta de usuarios
    const response = await request(app)
      .get("/users")
      .expect("Content-Type", /json/) // Esperar una respuesta JSON
      .expect(200); // Esperar código de estado 200 (OK)

    // Log para depuración
    console.log("Response body:", response.body);

    // Verificaciones de la respuesta
    expect(response.body.ok).toBe(true); // Comprobar que la respuesta es exitosa
    expect(response.body.users).toEqual(mockUsers); // Verificar que los usuarios devueltos coinciden
  });

  // Prueba para manejar errores en la obtención de usuarios
  it("should handle errors", async () => {
    // Configurar el mock de User.find para rechazar con un error
    User.find.mockRejectedValue(new Error("Error inesperado"));

    // Realizar solicitud GET esperando un error de servidor
    const response = await request(app)
      .get("/users")
      .expect("Content-Type", /json/)
      .expect(500); // Esperar código de estado 500 (Error interno del servidor)

    // Verificaciones de la respuesta de error
    expect(response.body.ok).toBe(false);
    expect(response.body.msg).toBe("Error inesperado");
  });
});


//********************************************☆*: .｡. o(≧▽≦)o .｡.:*☆*********************************
//*****************************************************************************************************



// Grupo de pruebas para la ruta POST de creación de usuarios
describe("POST /users", () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  // Prueba para crear un nuevo usuario
  it("should create a new user", async () => {
    // Mock del usuario que será devuelto después de guardar
    const mockSavedUser = {
      id: "1",
      name: "John",
      email: "jh@hotmail.com",
      password: "hashedPassword",
      save: jest.fn().mockResolvedValue(true),
    };

    // Configurar mocks para simular la creación de usuario
    User.findOne.mockResolvedValue(null); // Simular que no existe un usuario previo
    bcrypt.genSaltSync.mockReturnValue("salt"); // Simular generación de salt
    bcrypt.hashSync.mockReturnValue("hashedPassword"); // Simular hasheo de contraseña

    // Mock del constructor de User
    User.mockImplementation(() => mockSavedUser);

    // Mock de generación de token
    generarJWT.mockResolvedValue("mock-token");

    // Realizar solicitud POST para crear usuario
    const response = await request(app)
      .post("/users")
      .send({
        name: "John",
        email: "jh@hotmail.com",
        password: "123456",
      })
      .expect("Content-Type", /json/)
      .expect(201); // Esperar código de estado 201 (Creado)

    // Verificaciones de la respuesta
    expect(response.body.ok).toBe(true);
    expect(response.body.msg).toBe("User Created");
    expect(response.body.newUser).toEqual({
      name: "John",
      email: "jh@hotmail.com",
      password: "**************",
    });
    expect(response.body.token).toBe("mock-token");

    // Verificar que los mocks fueron llamados correctamente
    expect(User.findOne).toHaveBeenCalledWith({ email: "jh@hotmail.com" });
    expect(bcrypt.genSaltSync).toHaveBeenCalled();
    expect(bcrypt.hashSync).toHaveBeenCalledWith("123456", "salt");
    expect(generarJWT).toHaveBeenCalledWith("1");
  });

  // Prueba para manejar usuario existente
  it("should return error if user already exists", async () => {
    // Limpiar el mock del constructor de User para esta prueba
    User.mockImplementation(() => {});

    // Configurar mock para simular usuario existente
    User.findOne.mockResolvedValue({ email: "jh@hotmail.com" });

    // Realizar solicitud POST
    const response = await request(app)
      .post("/users")
      .send({
        name: "John",
        email: "jh@hotmail.com",
        password: "123456",
      })
      .expect("Content-Type", /json/)
      .expect(400); // Esperar código de estado 400 (Solicitud incorrecta)

    // Verificaciones de la respuesta de error
    expect(response.body.ok).toBe(false);
    expect(response.body.msg).toBe("El usuario ya existe");

    // Verificar que findOne fue llamado
    expect(User.findOne).toHaveBeenCalledWith({ email: "jh@hotmail.com" });
  });

  // Prueba para manejar errores generales
  it("should handle errors", async () => {
    // Limpiar el mock del constructor de User para esta prueba
    User.mockImplementation(() => {});

    // Configurar mock para simular error inesperado
    User.findOne.mockRejectedValue(new Error("Error inesperado"));

    // Realizar solicitud POST
    const response = await request(app)
      .post("/users")
      .send({
        name: "John",
        email: "jh@hotmail.com",
        password: "123456",
      })
      .expect("Content-Type", /json/)
      .expect(500); // Esperar código de estado 500 (Error interno del servidor)

    // Verificaciones de la respuesta de error
    expect(response.body.ok).toBe(false);
    expect(response.body.msg).toBe("Error inesperado");

    // Verificar que findOne fue llamado y lanzó el error
    expect(User.findOne).toHaveBeenCalledWith({ email: "jh@hotmail.com" });
  });
});
