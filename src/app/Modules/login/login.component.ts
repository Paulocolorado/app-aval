import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/Services/datos.service';
import { RespUsuario } from 'src/app/Models/resp-usuario';
import { RespIp } from 'src/app/Models/resp-ip';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // VARIABLES
  selectedFile: File = null;

  botonInvitado = { texto: 'Invitado', estado: true };
  botonIngresar = { texto: 'Ingresar', estado: false };
  documento = { numero: '', tipo: '', estado: false };
  numAccionista = { numero: '', estado: false };
  mensaje = { texto: '', color: '', estado: false };

  respuestaLogueo: RespUsuario;
  respuestaIP: RespIp;

  constructor(public Datos: DatosService, private http: HttpClient) { }

  ngOnInit() { }

  valDocumento() {
    if (this.documento.numero !== '') {
      this.documento.estado = true;
    } else {
      this.documento.estado = false;
    }
    this.valIngreso();
  }

  valNumAccionista() {
    if (this.numAccionista.numero !== '') {
      this.numAccionista.estado = true;
    } else {
      this.numAccionista.estado = false;
    }
    this.valIngreso();
  }

  valIngreso() {
    if (this.documento.estado && this.numAccionista.estado && this.documento.tipo !== '') {
      this.botonIngresar.estado = true;
    } else {
      this.botonIngresar.estado = false;
    }
  }

async  valIninvitado() {
      this.botonIngresar.estado = false;
      localStorage.setItem('pantalla', 'asamblea');
      localStorage.setItem('autoriza', false + '');
      localStorage.setItem('preguntas', '');
      localStorage.setItem('actionsAttorney', "[]");
      localStorage.setItem('usuario', "Invitado");
  }

  async ingresar() {
    this.botonIngresar.texto = 'Procesando...';
    const tip = this.documento.tipo;
    const num = this.documento.numero;
    const accion = this.numAccionista.numero;
    let respuesta: any;
    try {
      let IP :any;  
      try {
        IP = await this.Datos.GetIP().toPromise();
        this.respuestaIP = IP;
      } catch (e) { this.respuestaIP = { ip: '0.0.0.0' }; }   
      let ipSend = this.respuestaIP.ip + '%3Bact';
      respuesta = await this.Datos.GetLogueo(tip, num, accion, ipSend).toPromise();
      this.respuestaLogueo = respuesta;
      //console.log(this.respuestaLogueo);
      if (this.respuestaLogueo.responseStatus.returnCode === '00') {
        this.mensaje = {
          estado: true,
          color: 'alert-success',
          texto: 'Bienvenido ' + this.respuestaLogueo.shareHolder.nombresApellidos + ', lo estamos direccionando a la asamblea.',
        };
        if (this.respuestaLogueo.shareHolder.moderador) {
          localStorage.setItem('pantalla', 'control');
          localStorage.setItem('usuario', this.respuestaLogueo.shareHolder.nombresApellidos);
          localStorage.setItem('numaccion', this.respuestaLogueo.shareHolder.numeroAccion);
        } else {
          localStorage.setItem('pantalla', 'asamblea');
          localStorage.setItem('autoriza', this.respuestaLogueo.shareHolder.autoriza + '');
          localStorage.setItem('preguntas', ',' + this.respuestaLogueo.shareHolder.preguntas + ',');
          localStorage.setItem('actionsAttorney', JSON.stringify(this.respuestaLogueo.actionsAttorney));
          localStorage.setItem('usuario', this.respuestaLogueo.shareHolder.nombresApellidos);
          localStorage.setItem('tipDoc', tip);
          localStorage.setItem('numDoc', num);
          localStorage.setItem('accion', accion);
        }
      } else {
        //texto: this.respuestaLogueo.responseStatus.menssage
        if(this.respuestaLogueo.responseStatus.returnCode === '98'){
          this.mensaje = {
            estado: true,
            color: 'alert-warning',
            texto: this.respuestaLogueo.responseStatus.menssage,
          };
  
        }else{
          this.mensaje = {
            estado: true,
            color: 'alert-warning',
            texto: "Información o datos de Identificación incompletos",
          };
  
        }
        this.numAccionista = {
          numero: '',
          estado: false,
        };
        this.botonIngresar.texto = 'Nuevo intento';
        this.valIngreso();
      }
    } catch (e) {
      this.mensaje = {
        estado: true,
        color: 'alert-danger',
        texto: 'El servicio presenta errores. Por favor intente más tarde.',
      };
      this.numAccionista = {
        numero: '',
        estado: false,
      };
      this.botonIngresar.texto = 'Nuevo intento';
      this.valIngreso();
    }
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
