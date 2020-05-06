export interface RespPregunta {
  id: number;
  pregunta: string;
  descPregunta: string;
  observaciones: string;
  estado: string;
  fehCrea: string;
  userCrea: string;
  fehModifica: string;
  userMod: string;
}

export interface results {
 idPregunta: number;
 descPregunta: string;
 aprobado: number;
 noAprobado: number;
 meAbstengo: number;
}

