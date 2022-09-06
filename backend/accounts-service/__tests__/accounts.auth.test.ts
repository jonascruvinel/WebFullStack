import request from 'supertest';
import app from './../src/app';
import { IAccount } from '../src/models/account';
import repository from '../src/models/accountRepository';

const testEmail    = 'jest@accounts.auth.com'
const hashPassword = '$2a$10$atf5Hr07U9IIVHe/gTOJS.6FsxXYH8Py4SDB9O96K5XVpbASZNe5K'; //123456
const testPassword = '123456'

beforeAll(async () => {
    const testAccount : IAccount = {
        name:       'jest accounts.auth.test',
        email:      testEmail,
        phone:      '11901111111',
        password:   hashPassword,
        domain:     'teste.com'
    }
    await repository.add(testAccount);
})

afterAll(async () => {
    const account = await repository.removeByEmail(testEmail);
})

describe('Testando rotas de autenticação', () => {
    it('POST /accounts/login - 200 Ok', async () => {
        //testing
        const payload = {
            email:      testEmail,
            password:   testPassword
        }

        const resultado = await request(app)
            .post('/accounts/login')
            .send(payload)

        expect(resultado.status).toEqual(200);
    })

    it('POST /accounts/login - 422 Unprocessable Entity', async () => {
        const payload = {
            email:      testEmail
        }

        const resultado = await request(app)
            .post('/accounts/login')
            .send(payload)

        expect(resultado.status).toEqual(422);
    })

    it('POST /accounts/login - 401 Unauthorized', async () => {
        const payload = {
            email:      testEmail,
            password:   testPassword + '1'
        }

        const resultado = await request(app)
            .post('/accounts/login')
            .send(payload)

        expect(resultado.status).toEqual(401);
    })

    it('POST /accounts/logout - 200 Ok', async () => {
        const resultado = await request(app)
            .post('/accounts/logout')

        expect(resultado.status).toEqual(200);
    })
})