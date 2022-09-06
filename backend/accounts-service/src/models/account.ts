import { AccountStatus } from './accountsStatus';

export interface IAccount{
    id?: number,
    name: string,
    email: string,
    phone: string,
    password: string,    
    status?: AccountStatus,
    domain: string
}
