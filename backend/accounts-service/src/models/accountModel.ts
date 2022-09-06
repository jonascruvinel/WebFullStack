import Sequelize, { Model, Optional } from 'sequelize';
import database from 'ms-commons/data/db';
import  {IAccount} from './account';

interface IAccountCreationAttributes extends Optional<IAccount, "id">{}

export interface IAccountModel extends Model<IAccount, IAccountCreationAttributes>, IAccount{}

export default database.define<IAccountModel>('account', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(150),
        allowNull: false
        //unique: true
    },
    email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
    },
    phone: {
        type: Sequelize.STRING(13),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 100
    },
    domain: {
        type: Sequelize.STRING(100),
        allowNull: false
    }
})
