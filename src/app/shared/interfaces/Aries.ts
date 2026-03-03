export interface ConfirmacionMensaje {
  msjTipo: number;
  titulo: string;
  mensaje: string;
  detalle: string;
}

/**
 * listados para la aplicacion
 */
export interface list {
  id: number;
  descripcion: string;
}
  
export interface ConfirmacionMensaje {
  msjTipo: number;
  titulo:  string;
  mensaje: string;
  detalle: string;
}

export interface CfdiResponse {
  code: string;
  message: string;
  data: {
    XML: string;
    PDF: string;
    UUID: string;
  };
}