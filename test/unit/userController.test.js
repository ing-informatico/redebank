import request from 'supertest';
import express from 'express';
import { getUsers } from '../../controllers/userController';
import User from '../../models/user';

// Mock de User model
jest.mock('../../models/user');

const app = express();
app.get('/users', getUsers);

describe('GET /users', () => {
    it('should return all users', async () => {
        const mockUsers = [
            { email: 'jh@hotmail.com', name: 'John', password: '123456' },
            { email: 'jane@hotmail.com', name: 'Jane', password: '123456' },
            { email: 'jd@hotmail.com', name: 'Doe', password: '123456' }
        ];

        User.find.mockResolvedValue(mockUsers);

        const response = await request(app)
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200);

        console.log('Response body:', response.body); // Log para depuración

        expect(response.body.ok).toBe(true);
        expect(response.body.users).toEqual(mockUsers);
    });

    it('should handle errors', async () => {
        User.find.mockRejectedValue(new Error('Error inesperado'));

        const response = await request(app)
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(500);

        expect(response.body.ok).toBe(false);
        expect(response.body.msg).toBe('Error inesperado');
    });
});


//Test para crear un user nuevo
describe('POST /users', () => {
    it('should create a new user', async () => {
        const mockUser = { id:"1",name:"John",email:"jhgarzonmedina",password:"123456"};
            const mockToken= "token"
});