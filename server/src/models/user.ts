
import { Schema } from 'mongoose';
import { DatabaseResponse } from '../utils/model';
import ModelClass from '../utils/model';
import UserRepository from '../repositories/user';
import '../utils/string'

/**
 * User model
 * User model is used to create a new mongoose model and save it to mongodb database.
 * Class extends ModelClass<DatabaseResponse> which is used to create a new mongoose model.
 * Purpose of this class is to extend model with custom methods.
 */
class UserModel extends ModelClass<DatabaseResponse> {

    // public user identifier
    public _id: string = '';

    // public user first name
    public firstName: string = '';

    // public user last name
    public lastName: string = '';

    // public user email
    public email: string = '';

    // public user password
    public password: string = '';

    // public user active status
    public active: boolean = true;

    // public user deleted status
    public deleted: boolean = false;

    // public user jwt token
    public token: string = '';

    // public user date created
    public dateCreated: Date = new Date();

    // public user date updated
    public dateUpdated: Date = new Date();

    constructor(data: DatabaseResponse) {
        super(data);

        this.modelName = 'UserModel'
        this.collectionName = 'users';

        // Set schema definition
        // This schema will be used to create a new mongoose model when in terminal you run: yarn setup
        this.schema = new Schema({
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true, unique: true, index: true },
            password: { type: String, required: true, index: true },
            active: { type: Boolean, required: true, index: true },
            deleted: { type: Boolean, required: false, index: true },
            token: { type: String, required: false, index: true },
            dateCreated: { type: Date, required: true },
            dateUpdated: { type: Date, required: false },
        });

        // Set data to this model
        Object.assign(this, data);
    }


    public async login():Promise<UserModel | null>{
        const repo = new UserRepository();
        const pwd = await this.generatePassword();
        return await repo.login(this.email, pwd);
    }


    public async logout(){
        const repo = new UserRepository();
        return await repo.logout(this._id, this.token);
    }


    public async saveToken(): Promise<boolean> {
        const repo = new UserRepository();
        return await repo.saveToken(this._id, this.token);
    }


    public async register(): Promise<UserModel | null> {
        const repo = new UserRepository();
        return await repo.register(this);
    }

    public async remove(): Promise<boolean> {
        const repo = new UserRepository();
        return await repo.remove(this._id);
    }

    public async generatePassword(): Promise<string> {
        return await this.password.generateHash();
    }

    public async verifyToken(): Promise<string> {
        const repo = new UserRepository();
        return await repo.verifyToken(this._id, this.email);
    }
    
}

export default UserModel;
