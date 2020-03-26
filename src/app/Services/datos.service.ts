import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespUsuario } from '../Models/resp-usuario';
import { ReqRespuesta } from '../Models/req-respuesta';
import { RespIp } from '../Models/resp-ip';
import { ReqPregunta } from '../Models/req-pregunta';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  private tiposDocumento: any;

  // RESPUESTAS
  private respuestaIP: RespIp;
  private requestRespuesta: ReqRespuesta;

  constructor(private http: HttpClient) { }

  GetLogueo(tip: string, num: string, accion: string) {
    const URL = 'http://181.51.21.177/WsAsambleaAval-Prod/api/shareHolder/' + tip + '/' + num + '/' + accion;
    return this.http.get(URL);
  }

  GetQuestion() {
    const URL = 'http://181.51.21.177/WsAsambleaAval-Prod/api/AssemblyQuestion';
    return this.http.get(URL);
  }

  PostRespuesta(body: ReqRespuesta) {
    const URL = 'http://181.51.21.177/WsAsambleaAval-Prod/api/QuestionXAction';
    return this.http.post(URL, body).subscribe(data => data, error => console.log(error));
  }

  PutActualizarPre(body: ReqPregunta) {
    const URL = 'http://181.51.21.177/WsAsambleaAval-Prod/api/AssemblyQuestion/' + body.id;
    return this.http.put(URL, body);
  }

  PostCrearPregunta(body: ReqPregunta) {
    const URL = 'http://181.51.21.177/WsAsambleaAval-Prod/api/AssemblyQuestion';
    return this.http.post(URL, body);
  }

  GetIP() {
    return this.http.get('https://api.ipify.org?format=json');
  }

  GetTiposDocumento() {
    this.tiposDocumento = [
      { id: 'cc', nombre: 'Cédula de ciudadanía' },
      { id: 'ce', nombre: 'Cédula de extranjería' },
      { id: 'nit', nombre: 'NIT' },
      { id: 'ps', nombre: 'Pasaporte' },
    ];
    return this.tiposDocumento;
  }

}
