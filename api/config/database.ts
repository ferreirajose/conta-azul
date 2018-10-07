import * as Datastore from 'nedb';

class DataStoreVehicles {
    private dbName: string;
    public db: Datastore;

    constructor() {
        this.db = new Datastore({
            filename: './api/data.db',
            autoload: true
        });
    }
}

export default new DataStoreVehicles().db;
