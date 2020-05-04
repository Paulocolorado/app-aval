import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/Services/datos.service';
import { RespPregunta } from 'src/app/Models/resp-pregunta';
import { ReqPregunta } from 'src/app/Models/req-pregunta';
import { HttpClient } from '@angular/common/http';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  selectedFile: File = null;

  numacccion = localStorage.getItem('numaccion');

  mensaje = { mensaje: '', color: '', estado: false };
  preguntaCrear = { pregunta: '', observaciones: '' , idpreg :''};
  botonCrear = { texto: 'Crear pregunta', estado: true };
  botonActivar = { texto: 'Activar', estado: true };

  respuestaPreguntas = [] as RespPregunta[];

  respuestaActualizar: RespPregunta;

  constructor(private Datos: DatosService, private http: HttpClient) { }

  ngOnInit() {
    this.listaPreguntas();
  }

  async listaPreguntas() {
    let respuesta: any;
    try {
      respuesta = await this.Datos.GetQuestion().toPromise();
      this.respuestaPreguntas = respuesta;
    } catch (e) {
      this.mensaje = {
        mensaje: 'Error en la consulta de las preguntas. Recargue o consulte con el administrador.',
        color: 'alert-danger',
        estado: true,
      };
    }
  }

  async activarPregunta(pregunta: ReqPregunta) {
    this.botonActivar = { texto: 'Activando...', estado: false };
    let respuesta: any;
    const dateobj = new Date();
    const B = dateobj.toISOString();
    const body = {
      id: pregunta.id,
      pregunta: pregunta.pregunta,
      descPregunta: pregunta.descPregunta,
      observaciones: pregunta.observaciones,
      estado: 'A',
      fehCrea: pregunta.fehCrea,
      userCrea: pregunta.userCrea,
      fehModifica: B,
      userMod: this.numacccion,
    } as ReqPregunta;
    try {
      respuesta = await this.Datos.PutActualizarPre(body).toPromise();
      this.respuestaActualizar = respuesta;
      this.listaPreguntas();
      console.log(this.respuestaActualizar);
      this.mensaje = {
        mensaje: 'La pregunta ' + pregunta.pregunta + ' fue actualizada correctamente.',
        color: 'alert-success',
        estado: true,
      };
    } catch (e) {
      this.mensaje = {
        mensaje: 'La pregunta ' + pregunta.pregunta + ' no pudo ser actualizada, recargue e intente de nuevo.',
        color: 'alert-danger',
        estado: true,
      };
    }
    this.botonActivar = { texto: 'Activar', estado: true };
    setTimeout(() => {
      this.mensaje.estado = false;
    }, 8000);
  }

  async crearPregunta() {
    $('.modal-crear').modal('hide');
    this.botonCrear = { texto: 'Creando pregunta...', estado: false };
    let respuesta: any;
    const dateobj = new Date();
    const B = dateobj.toISOString();
    const body = {
      descPregunta: this.preguntaCrear.pregunta,
      estado: 'D',
      fehCrea: B,
      fehModifica: B,
      id: null,
      observaciones: this.preguntaCrear.observaciones,
      pregunta: this.preguntaCrear.idpreg,
      userCrea: this.numacccion,
      userMod: this.numacccion,
    } as ReqPregunta;
    try {
      respuesta = await this.Datos.PostCrearPregunta(body).toPromise();
      this.preguntaCrear = {
        observaciones: '',
        pregunta: '',
        idpreg:''
      };
      this.listaPreguntas();
      this.mensaje = {
        mensaje: 'La pregunta fue creada correctamente.',
        color: 'alert-success',
        estado: true,
      };
    } catch (e) {
      this.mensaje = {
        mensaje: 'Surgió un error al intentar crear la pregunta, intente de nuevo o consulte con el administrador.',
        color: 'alert-danger',
        estado: true,
      };
    }
    this.botonCrear = { texto: 'Crear pregunta', estado: true };
    setTimeout(() => {
      this.mensaje.estado = false;
    }, 8000);
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    console.log(event);
  }

  onUpload(){
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.http.post('http://181.51.21.177/WsAsambleaAval-Prod/api/shareHolder/upload-csv-file', fd)
    .subscribe(res => {
      console.log(res);
    })
  }

}
