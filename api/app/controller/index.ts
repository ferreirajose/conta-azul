// var db = require('../../config/database');
import { Request, Response } from 'express';
import DataStoreVehicles from '../../config/database';

export class VehiclesController {

  //private data: DataStoreVehicles;

  constructor() {
    //this.data = new DataStoreVehicles();
  }

  public getNewVehicles(req: Request, res: Response) {
    DataStoreVehicles.find({}, (err, doc) => {
      if (err) {
        return res.status(500).json({ erro: `Não foi possivel realização operação : ${err}` });
      }

      if (doc) {
        return res.json(doc);
      }

      res.status(404).json({ msn: `Recurso solicitado não foi Encontrado: ${doc}` });
    });
  }

  public getNewVehiclesById(req: Request, res: Response): void {
    DataStoreVehicles.findOne({ _id: req.params.id }, (err, doc) => {
      if (err) {
        return res.status(500).json({ erro: `Não foi possivel realização operação : ${err}` });
      }

      if (doc) {
        return res.json(doc);
      }

      res.status(404).json({ msn: `Recurso solicitado não foi Encontrado: ${doc}` });
    });
  }

  public addNewVehicles(req: Request, res: Response): void {
    DataStoreVehicles.insert(req.body, (err, newVeh) => {
      if (err) {
        return res.status(500).json({ erro: `Não foi possivel realização operação : ${err}` });
      }

      res.status(200).json({ msn: `Adicionado com sucesso: ${newVeh._id}` });
    });
  }

  public deleteVehiclesById(req: Request, res: Response): void {
    DataStoreVehicles.remove({ _id: req.params.id }, (err, numRemoved) => {
      if (err) {
        return res.status(500).json({ erro: `Não foi possivel realização operação : ${err}` });
      }

      res.status(200).json({ msn: `Removido com sucesso o registro: ${req.params.id}` });
    });
  }

  public updateVehicles(req: Request, res: Response): void {
    DataStoreVehicles.update({ _id: req.params.id }, req.body, (err, numReplaced) => {
      if (err) {
        return res.status(500).json({ erro: `Não foi possivel realização operação : ${err}` });
      }

      res.status(201).json({ msn: `Atualizado com sucesso o registro: ${req.body._id}` });
    });
  }

}
