import request from 'supertest';
import app from './../src/app';
import { IAccount } from '../src/models/account';
import repository from '../src/models/accountRepository';
import auth from '../src/auth';

const testEmail    = 'jest@accounts.com'
const testEmail2    = 'jest2@accounts.com'
const hashPassword = '$2a$10$atf5Hr07U9IIVHe/gTOJS.6FsxXYH8Py4SDB9O96K5XVpbASZNe5K'; //123456

let jwt : string = '';
let testID: number = 0;

beforeAll(async () => {
    const testAccount : IAccount = {
        name:       'jest accounts.test',
        email:      testEmail,
        phone:      '11911111111',
        password:   hashPassword,
        domain:     'teste.com'
    }
    const result = await repository.add(testAccount);
    testID = result.id!;
    jwt = auth.sign(result.id!);
})

afterAll(async () => {
    const result = await repository.removeByEmail(testEmail);
    const result2 = await repository.removeByEmail(testEmail2); 
})

describe('Testando rotas do accounts', () => {
   it('POST /accounts/ - Deve retorna statuscode 201', async () => {
        const payload : IAccount = {
            name:       'jest2',
            email:      testEmail2,
            phone:      '11991111111',
            password:   '123456',
            domain:     'teste.com'
        }

        const resultado = await request(app)
            .post('/accounts/')
            .send(payload);

        expect(resultado.status).toEqual(201);
    })

    it('POST /accounts/ - Deve retorna statuscode 422', async () => {
        const payload = {
            street:     'Rua Riskallah Jorge, 50',
            city:       'São Paulo',
            state:      'São Paulo'
        }

        const resultado = await request(app)
            .post('/accounts/')
            .send(payload)

        expect(resultado.status).toEqual(422)
    })

    it('GET /accounts/ - Deve retornar statuscode 200', async () => {
        const resultado = await request(app)
            .get('/accounts/')
            .set('x-access-token', jwt);
        
        expect(resultado.status).toEqual(200);
        expect(Array.isArray(resultado.body)).toBeTruthy();
    })

    it('GET /accounts/:id - Deve retornar statuscode 200', async () => {
        const resultado = await request(app)
            .get('/accounts/1')
            .set('x-access-token', jwt);

        expect(resultado.status).toEqual(200);
    })
    
    it('GET /accounts/:id - Deve retornar statuscode 404', async () => {
        const resultado = await request(app)
            .get('/accounts/-1')
            .set('x-access-token', jwt);

        expect(resultado.status).toEqual(404);
    })

    it('GET /accounts/:id - Deve retornar statuscode 404', async () => {
        const resultado = await request(app)
            .get('/accounts/abc')
            .set('x-access-token', jwt);
        
            expect(resultado.status).toEqual(404);
    })
    
    it('PATCH /accounts/:id - Deve retorna statuscode 200', async () => {
        const payload = {
            name: "Jonas Cruvinel",
            phone: "11966644910",
            password: "123456789",
            domain: "teste.com.br"
        }

        const resultado = await request(app)
            .patch('/accounts/' + testID)
            .send(payload)
            .set('x-access-token', jwt);

        expect(resultado.status).toEqual(200);
    })

    it('PATCH /accounts/:id - Deve retorna statuscode 400', async () => {
        const payload = {
            name: "Jonas Cruvinel de Oliveira Junior"
        }

        const resultado = await request(app)
            .patch('/accounts/abc')
            .send(payload)
            .set('x-access-token', jwt);

        expect(resultado.status).toEqual(400);
    })

    it('PATCH /accounts/:id - Deve retorna statuscode 404', async () => {
        const payload = {
            name: "Junior"
        }

        const resultado = await request(app)
            .patch('/accounts/-1')
            .send(payload)
            .set('x-access-token', jwt);

        expect(resultado.status).toEqual(404);
    })
})
