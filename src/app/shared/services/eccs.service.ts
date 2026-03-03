import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EccsService {

   //--=============================================================================================================
  //?-- ARIES ERP - VE - convertir bytea a imagen
  // Convierte el bytea de PostgreSQL a una URL de imagen mostrable
  public convertirByteaAImagen(bytea: any): string {
    try {
      let uint8Array: Uint8Array;
      
      // Si viene como string hexadecimal (\xffd8ffe0...)
      if (typeof bytea === 'string' && bytea.startsWith('\\x')) {
        // Remover el prefijo \x y convertir hex a bytes
        const hexString = bytea.substring(2);
        const bytes = [];
        for (let i = 0; i < hexString.length; i += 2) {
          bytes.push(parseInt(hexString.substr(i, 2), 16));
        }
        uint8Array = new Uint8Array(bytes);
      }
      // Si viene como Buffer con data property
      else if (bytea.data && Array.isArray(bytea.data)) {
        uint8Array = new Uint8Array(bytea.data);
      }
      // Si viene como array de bytes directo
      else if (Array.isArray(bytea)) {
        uint8Array = new Uint8Array(bytea);
      }
      // Si viene como Uint8Array
      else if (bytea instanceof Uint8Array) {
        uint8Array = bytea;
      }
      else {
        return 'icons/logo.png';
      }
      
      // Crear Blob desde los bytes
      const blob = new Blob([uint8Array.buffer as ArrayBuffer], { type: 'image/jpeg' });
      
      // Crear URL del objeto para mostrar la imagen
      return URL.createObjectURL(blob);
      
    } catch (error) {
      console.error('Error convirtiendo imagen:', error);
      return 'icons/logo.png';
    }
  }

}
