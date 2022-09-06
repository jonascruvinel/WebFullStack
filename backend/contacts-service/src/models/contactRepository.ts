import contactModel, {IcontactModel} from "./contactModel";
import { IContact } from "./contacts";

function findById(contactId: number, accountId: number){
    return contactModel.findOne<IcontactModel>({where: {id: contactId, accountId: accountId}});
}

function findAll(accountId: number) {
    return contactModel.findAll<IcontactModel>({where: {accountId}})
}

async function add(contact: IContact, accountId: number){
    contact.accountId = accountId;
    const result = await contactModel.create(contact);
    contact.id = result.id!;
    return contact;
}

async function set(contactId: number, contact: IContact, accountId: number){
    const originalContact = await contactModel.findOne({where: {id: contactId, accountId: accountId}});
    if(!originalContact) return null;

    if(contact.name) originalContact.name = contact.name;
    if(contact.phone) originalContact.phone = contact.phone;
    if(contact.status) originalContact.status = contact.status;

    const result = await originalContact.save();
    contact.id = result.id;
    return contact;
}

function removeById(contactId: number, accountId: number) {
    return contactModel.destroy({where: {id: contactId, accountId: accountId}});
}

function removeByEmail(email: string, accountId: number) {
    return contactModel.destroy({where:{email, accountId}});
}

export default { findAll, findById, add, set, removeById, removeByEmail };