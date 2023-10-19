

import { Schema, model, Model } from "mongoose";

export interface DatabaseResponse {
        // your interface properties here
}

export interface ModelType<T> {
        modelName: string;
        schema: Schema;
        getModel(): Model<T>;
        getSchema(): Schema;
        data: (skip_id:boolean) => any;
}

export default class ModelClass<T> implements ModelType<T> {

        public modelName: string = '';

        public collectionName: string = '';

        public schema: Schema;

        constructor(data: DatabaseResponse) {
                this.schema = new Schema({});
                Object.assign(this, data);
        }

        public getModel(): Model<T> {
                return model<T>(this.modelName, this.schema);
        }

        public getSchema(): Schema {
                return this.schema;
        }

        public data(skip_id = false): any {
                const d: any = {};

                this.schema.eachPath((path) => {
                        d[path] = this[path as keyof this];
                });

                if(skip_id) {
                        delete d._id;
                }

                if(d.password){
                   delete d.password;
                }

                return d;
        }
}