import {Router} from 'express';
import middlewareCommons from 'ms-commons/api/routes/middlewares';
import {validateContactSchema, validateUpdateContactSchema} from './middlewares';
import controller from '../controllers/contacts';

const router = Router();

router.get('/contacts/:id', middlewareCommons.validadeAuth, controller.getContact);

router.get('/contacts/', middlewareCommons.validadeAuth, controller.getContacts);

router.post('/contacts/',  middlewareCommons.validadeAuth, validateContactSchema, controller.addContact);

router.patch('/contacts/:id',  middlewareCommons.validadeAuth, validateUpdateContactSchema, controller.setContact);

export default router;