import { Request, Response } from 'express';
import commonsMiddleware from 'ms-commons/api/routes/middlewares';
import { contactSchema,contacUpdatetSchema } from '../models/contactSchemas';

function validateContactSchema(req: Request, res: Response, next: any) {
    return commonsMiddleware.validateSchema(contactSchema, req, res, next);
}

function validateUpdateContactSchema(req: Request, res: Response, next: any) {
    return commonsMiddleware.validateSchema(contacUpdatetSchema, req, res, next);
}


export { validateContactSchema, validateUpdateContactSchema }