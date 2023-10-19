import mongoose from "mongoose";
import {  DbConnections, MongoInstance } from "../types";

export class Database {

    public static db:DbConnections = null;

    public async connect(): Promise<MongoInstance | null> {

        const conn = await this.connectMongo().then((c:mongoose.Connection | null) => { 
            return c;
        }).catch((err) => {
            throw err;
        });

        return conn || null;

    }

    /**
     * Connect to MongoDB
     * @description Connect to MongoDB and return a promise with the connection instance
     * @description If the connection is already established, return the instance. Singleton pattern
     * @access private
     * @static
     * @async
     * @param void
     * @returns Promise<MongoInstance | null>
     */
    private async connectMongo(): Promise<MongoInstance | null> {
        const MONGO_URI:string = `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`; 
        

        return new Promise((resolve, reject) => {

            if(Database.db) return resolve(Database.db);

            try {
                mongoose.set('strictQuery', false);
                mongoose.connect(MONGO_URI);
            } catch (err) {
                return reject(err);
            }

            Database.db = mongoose.connection;
            

            Database.db.on('error', function(err) {
                console.log('MongoDB connection error: ' + err);
                Database.db = null;
                reject(err);
            });

            Database.db.once('open', function() {
                console.log('MongoDB Connected');
                resolve(Database.db);
            });
        });

    }

    public async disconnect(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                if(Database.db){
                    Database.db.close();
                    Database.db = null;
                }
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

}