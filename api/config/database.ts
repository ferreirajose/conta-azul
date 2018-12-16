import * as Datastore from 'nedb';

class DataStoreVehicles {
    private dbName: string;
    public db: Datastore;

    constructor() {
        this.db = new Datastore({
            filename: './data.db',
            autoload: true
        });
    }
}

export default new DataStoreVehicles().db;
