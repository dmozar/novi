import UserModel from "../models/user";
import { Database } from "../utils/database";
import { ObjectId } from "mongodb";

class UserRepository extends Database {


  constructor() {
    super();
  }

  /**
   * Login user
   * 
   * @description Login user and set session. Valiadate email and password, match with database mongodb model.
   * @param email 
   * @param password 
   * @returns Promise<User | null>
   */
  async login(email: string, password: string): Promise<UserModel | null> {

    const conn = await this.connect();

    if (!conn) {
      throw new Error('Could not connect to database in UserRepository.login()');
    };

    return new Promise<UserModel | null>(async(resolve, reject) => {
 
      try {
        const user = await conn.collection('users').findOne({ email, password, active: 1 });
        const response = user ? new UserModel(user) : null;
        resolve(response);
      } catch (err) {
        reject(err);
      } finally {
        this.disconnect();
      }
    });

  }


  async saveToken(id: string | null | undefined, token: string | undefined | null): Promise<boolean> {
    
    if(!token) return Promise.reject('Error 10220: Token is not defined');
    if(!id)    return Promise.reject('Id is not defined');
    
    const conn = await this.connect();

    if (!conn) {
      throw new Error('Could not connect to database in UserRepository.saveToken()');
    };

    return new Promise<boolean>((resolve, reject) => {
      try {

        const update = { $set: {token: token, dateUpdated: new Date()} };

        conn.collection('users').updateOne({_id: new ObjectId(id)}, update).then((response) => {
          resolve(!!response.upsertedCount);
        }).catch((err) => reject(err));

      } catch (err) {
        return reject(err);
      }
    });
  }


  async verifyToken(id: string | null | undefined, email: string | undefined | null): Promise<string> {
      
      if(!email) return Promise.reject('Error: 10332: Email session is not defined');
      if(!id)    return Promise.reject('Id is not defined');
      
      const conn = await this.connect();
  
      if (!conn) {
        throw new Error('Could not connect to database in UserRepository.verifyToken()');
      };
  
      return new Promise<string>((resolve, reject) => {
        try {

          const filter = {_id: new ObjectId(id), email: email};
  
          const response = conn.collection('users').findOne(filter).then((response) => {
            return response?.token
          }).catch((err) => reject(err));
  
          resolve(response);
        } catch (err) {
          return reject(err);
        }
      });
  }


  /**
   * Logout user
   * 
   * @description Logout user and remove session. Remove token from database mongodb model.
   * @param id 
   * @param token 
   * @returns 
   */
  async logout(id: string, token: string): Promise<boolean> {

    const conn = await this.connect();

    if (!conn) {
      throw new Error('Could not connect to database in UserRepository.logout()');
    };

    return new Promise<boolean>((resolve, reject) => {

      const update = { $set: {token: null, dateUpdated: new Date()} };

      try {
        conn.collection('users').updateOne({_id: new ObjectId(id)}, update).then((response) => {
          resolve( response.modifiedCount ? true : false );
        }).catch((err) => reject(err));
      } catch (err){
        reject(err);
      }

    });
  }



  async remove(_id: string): Promise<boolean> {
    return new Promise( async (resolve) => {
      const conn = await this.connect();

      if (!conn) {
        throw new Error('Could not connect to database in UserRepository.remove()');
      };

      try {
        const response = await conn.collection('users').deleteOne({_id: new ObjectId(_id)});
        resolve( response.deletedCount ? true : false );
      } catch (_err) {
        resolve(false);
      }

    });
  }



  async register(user: UserModel): Promise<UserModel | null> {

    return new Promise(async (resolve, reject) => {

      const data = user.data(true);
      data.password = await user.generatePassword();
      
      const conn = await this.connect();

      if (!conn) {
        throw new Error('Could not connect to database in UserRepository.register()');
      };
        
      await conn.collection('users').insertOne(data).then((response) => {
        const id = response.insertedId.toString();
        user._id = id;
        resolve(user);
      }).catch((err) => reject(err));
    });
    
  }


}


export default UserRepository;