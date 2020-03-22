import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  item = 'asamblea';
  private tiposDocumento: any;
  private logueado: boolean;

  constructor() { }

  GetTiposDocumento() {
    this.tiposDocumento = [
      { id: '1', nombre: 'Cédula de ciudadanía' },
      { id: '2', nombre: 'Cédula de extrnajería' },
      { id: '3', nombre: 'NIT' },
      { id: '4', nombre: 'Pasaporte' },
    ];
    return this.tiposDocumento;
  }

  GetLogueado() {
    return this.logueado;
  }

  SetLogueado(logueado) {
    return this.logueado = logueado;
  }


}
