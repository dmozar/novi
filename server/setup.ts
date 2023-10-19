import dotenv from 'dotenv';
import { Database } from "./src/utils/database";
import fs from 'fs';

dotenv.config();


const db = new Database();

db.connect().then(async (conn) => {

    if(conn){
        console.log('Connected to database');

        // read files in directory ./src/models and get list of files
        const listFiles = fs.readdirSync('./src/models');

        // loop through list of files and import models
        for(let file of listFiles) {
            const model = await import (`./src/models/${file}`);
            await Promise.resolve(model).then(async(m) => {
                console.log('imported model', m.default);
                const collection = new m.default({});
                // delete model from mongoose if it exists
                console.log('try to delete model',collection.collectionName)
                try {
                    await conn.collection(collection.collectionName).drop();
                    console.log('Collection '+collection.collectionName+' deleted');
                } catch (err) {
                    console.log(`Collection ${collection.collectionName} does not exist. Skip delete`);
                }

                const schema = collection.getSchema();
                const Model = await conn.model(collection.collectionName, schema);
                await Model.ensureIndexes();
            });
        }

        // terminate connection
        conn.close();
        console.log('Connection closed');
        console.log('Done');
        process.exit(0);

    } else {
        console.log('Could not connect to database');
    }

}).catch((err) => {
  console.log(err);
});
