import { DatosService } from 'src/app/Services/datos.service';
import { RespIp } from 'src/app/Models/resp-ip';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario = localStorage.getItem('usuario');

  ima1 = true;
  ima2 = false;

  constructor(public Datos: DatosService) { }

  ngOnInit() {
    var ua = navigator.userAgent;
    var x = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) ; 
    if(!x){
      var wt = window.innerWidth; 
      this.ima1 = wt >= 1200; 
      this.ima2 = wt <= 1200; 
    }
    //this.ima1 = !x;
  }

  asamblea() {
    localStorage.setItem('pantalla', 'asamblea');
  }

  inicio() {
    localStorage.setItem('pantalla', '');
    localStorage.setItem('preguntas', '');
    localStorage.setItem('actionsAttorney', '');
    localStorage.setItem('preguntaResuelta', '');
    localStorage.setItem('autoriza', '');
    localStorage.setItem('usuario', '');
  }

  async cerrar() {
    const tip = localStorage.getItem('tipDoc');
    const num =  localStorage.getItem('numDoc');
    const accion = localStorage.getItem('accion');
    let respuesta: any;
    let respuestaIP: RespIp;
    try {
      let IP :any;  
      try {
        IP = await this.Datos.GetIP().toPromise();
        respuestaIP = IP;
      } catch (e) { respuestaIP = { ip: '0.0.0.0' }; }   
      let ipSend = respuestaIP.ip + '%3Bcan';
      // console.log(tip +" "+ num +" "+ accion +" "+ ipSend);
      respuesta = await this.Datos.GetLogueo(tip, num, accion, ipSend).toPromise();
    } catch (e) { e.console.error();}
    //setTimeout(() => {
      localStorage.setItem('preguntas', '');
      localStorage.setItem('actionsAttorney', '');
      localStorage.setItem('preguntaResuelta', '');
      localStorage.setItem('autoriza', '');
      localStorage.setItem('pantalla', '');
      localStorage.setItem('usuario', '');     
      localStorage.setItem('tipDoc', ''); 
      localStorage.setItem('numDoc', '');
      localStorage.setItem('accion', '');
      localStorage.setItem('numaccion', '');
    //}, 500);
  }

  async estadoUsuario() {
    this.usuario = localStorage.getItem('usuario');
    if (this.usuario !== '') {
      return true;
    } else {
      return false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event){
    var ua = navigator.userAgent;
    var x = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) ; 
    if(x){
      this.ima1 = !x ;
    }else{
      var wt = window.innerWidth; 
      this.ima1 = wt >= 1200; 
      this.ima2 = wt <= 1200; 
    }
  }

}
