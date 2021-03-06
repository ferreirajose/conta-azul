import * as express from 'express';
import { VehiclesController } from '../controller/index';
export class Routes {

    private express: express.Application;
    private vehicles: VehiclesController;

    constructor(app: express.Application) {
        this.express = app;
        this.vehicles = new VehiclesController();
        this.routes();
    }

    public routes(): void {
        this.getAllVehicles();
        this.getVehiclesById();
    }

    private getAllVehicles(): void {
        this.express.route(`/v1/`)
            .get(this.vehicles.getNewVehicles)
            .post(this.vehicles.addNewVehicles);
    }

    private getVehiclesById(): void {
        this.express.route(`/v1/:id`)
            .get(this.vehicles.getNewVehiclesById)
            .put(this.vehicles.updateVehicles)
            .delete(this.vehicles.deleteVehiclesById);
    }
}
