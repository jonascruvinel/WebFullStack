//import { jest, describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
import accountsApp from '../../accounts-service/src/app';
import { IContact } from '../src/models/contacts';
import repository from '../src/models/contactRepository';

const testeEmail    = 'jest@accounts.com';
const testeEmail2   = 'jest2@accounts.com';
const testPassword  = '123456'
let jwt: string = '';
let testAccountId: number = 0;
let testContactId: number = 0;

beforeAll(async () => {
    const testeAccount  = {
        name: 'jest accounts',
        email: testeEmail,
        password: testPassword,
        domain: 'jest.accounts.com'
    }

    const account = await request(accountsApp)
        .post('/accounts/')
        .send(testeAccount);
    testAccountId = account.body.id;

    const result = await request(accountsApp)
        .post('/accounts/login')
        .send({
            email: testeEmail,
            password: testPassword
        });
    jwt = result.body.token;

    const testContact = {
        name: 'jest',
        email: testeEmail,
        phone: '51123456789'
    } as IContact;

    const result2 = await repository.add(testContact, testAccountId);
    testContactId = result2.id!;
})

afterAll(async () => {
    await repository.removeByEmail(testeEmail, testAccountId)
    await repository.removeByEmail(testeEmail2, testAccountId)

    await request(accountsApp)
        .delete('/accounts/' + testAccountId)
        .set('x-access-token', jwt);

    await request(accountsApp)
        .post('/accounts/logout')
        .set('x-access-token', jwt);
})

describe('Testando rotas do serviço contacts', () => {
    it('GET /contacts/ - Deve retornar statuscode 200', async () => {
        const resultado = await request(app)
            .get('/contacts/')
            .set('x-access-token', jwt);

        expect(resultado.status).toEqual(200);
        expect(Array.isArray(resultado.body)).toBeTruthy();
    })

    it('GET /contacts/:id - Deve retornar statuscode 200', async () => {
        const resultado = await request(app)
            .get('/contacts/' + testContactId)
            .set('x-access-token', jwt);

        expect(resultado.status).toEqual(200);
        expect(resultado.body.id).toEqual(testContactId);
    })

    it('GET /contacts/ - Deve retornar statuscode 401', async () => {
        const resultado = await request(app)
            .get('/contacts/');

        expect(resultado.status).toEqual(401);
    })

    it('GET /contacts/:id - Deve retornar statuscode 404', async () => {
        const resultado = await request(app)
            .get('/contacts/-1')
            .set('x-access-token', jwt);

        expect(resultado.status).toEqual(404);
    })

    it('GET /contacts/:id - Deve retornar statuscode 401', async () => {
        const resultado = await request(app)
            .get('/contacts/' + testContactId)

        expect(resultado.status).toEqual(401);
    })

    it('POST /contacts/ - Deve retornar statuscode 201', async () => {
        const testContact = {
            name: 'jest2',
            email: testeEmail2,
            phone: '51123456789'
        } as IContact;

        const resultado = await request(app)
            .post('/contacts/')
            .set('x-access-token', jwt)
            .send(testContact);

        expect(resultado.status).toEqual(201);
        expect(resultado.body.id).toBeTruthy();
    })

    
    it('POST /contacts/ - Deve retornar statuscode 422', async () => {
        const payload = {
            street: 'jest2'
        }

        const resultado = await request(app)
            .post('/contacts/')
            .set('x-access-token', jwt)
            .send(payload);

        expect(resultado.status).toEqual(422);
    })

    it('POST /contacts/ - Deve retornar statuscode 401', async () => {
        const payload = {
            name: 'jest3',
            email: testeEmail,
            phone: '51123456789'
        } as IContact;

        const resultado = await request(app)
            .post('/contacts/')
            .send(payload);

        expect(resultado.status).toEqual(401);
    })

    it('POST /contacts/ - Deve retornar statuscode 400', async () => {
        const payload = {
            name: 'jest3',
            email: testeEmail,
            phone: '51123456789'
        } as IContact;

        const resultado = await request(app)
            .post('/contacts/')
            .set('x-access-token', jwt)
            .send(payload);

        expect(resultado.status).toEqual(400);
    })

    it('PATCH /contacts/:id - Deve retornar statuscode 200', async () => {
        const payload = {
            name: 'jest_159'
        } as IContact;

        const resultado = await request(app)
            .patch('/contacts/' + testContactId)
            .set('x-access-token', jwt)
            .send(payload);

        expect(resultado.status).toEqual(200);
        expect(resultado.body.name).toEqual('jest_159');
    })

    it('PATCH /contacts/:id - Deve retornar statuscode 401', async () => {
        const payload = {
            name: 'jest'
        } as IContact;

        const resultado = await request(app)
            .patch('/contacts/' + testContactId)
            .send(payload);

        expect(resultado.status).toEqual(401);
    })

    it('PATCH /contacts/:id - Deve retornar statuscode 422', async () => {
        const payload = {
            street: 'jest'
        };

        const resultado = await request(app)
            .patch('/contacts/' + testContactId)
            .set('x-access-token', jwt)
            .send(payload);

        expect(resultado.status).toEqual(422);
    })

    it('PATCH /contacts/:id - Deve retornar statuscode 404', async () => {
        const payload = {
            name: 'jest3'
        };

        const resultado = await request(app)
            .patch('/contacts/-1')
            .set('x-access-token', jwt)
            .send(payload);

        expect(resultado.status).toEqual(404);
    })

    it('PATCH /contacts/:id - Deve retornar statuscode 400', async () => {
        const payload = {
            name: 'jest'
        };

        const resultado = await request(app)
            .patch('/contacts/abc')
            .set('x-access-token', jwt)
            .send(payload);

        expect(resultado.status).toEqual(400);
    })
})