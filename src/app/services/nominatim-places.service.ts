import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Interfaz para predicciones de Nominatim
 */
export interface AddressPrediction {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

/**
 * Servicio para integración con Nominatim (OpenStreetMap) Autocomplete
 * Proporciona funcionalidad de autocompletado de direcciones sin necesidad de API key
 */
@Injectable({
  providedIn: 'root'
})
export class NominatimPlacesService {

  private readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
  private readonly SPAIN_BBOX = '44.36,-9.30,36.00,-2.50'; // Bounding box de España

  constructor(private http: HttpClient) { }

  /**
   * Obtiene predicciones de direcciones basadas en la entrada del usuario
   * Usa Nominatim de OpenStreetMap (sin API key necesaria)
   * @param input - Texto de entrada del usuario (mínimo 2 caracteres)
   * @returns Observable con array de predicciones
   */
  public getPredictions(input: string): Observable<AddressPrediction[]> {
    if (!input || input.trim().length < 2) {
      return of([]);
    }

    const params = {
      q: input.trim(),
      format: 'json',
      addressdetails: '1',
      limit: '10',
      viewbox: this.SPAIN_BBOX,
      bounded: '0',  // Permitir búsqueda fuera de España si es necesario
      'accept-language': 'es'
    };

    // Construir query string manualmente (compatibilidad)
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
      .join('&');

    const url = `${this.NOMINATIM_BASE_URL}?${queryString}`;

    console.log('Buscando direcciones en Nominatim:', url);

    return this.http.get<any[]>(url, { withCredentials: false }).pipe(
      map((response: any[]) => {
        if (!Array.isArray(response)) {
          console.warn('Respuesta de Nominatim no es un array:', response);
          return [];
        }
        
        // Mapear respuesta a nuestro formato
        return response
          .filter(item => item && item.display_name && item.display_name.trim().length > 0)
          .slice(0, 10)
          .map(item => ({
            place_id: item.place_id || 0,
            display_name: item.display_name || item.name || input,
            lat: (item.lat || '0').toString(),
            lon: (item.lon || '0').toString(),
            type: item.type || 'unknown'
          }));
      }),
      catchError((error) => {
        console.error('Error obteniendo predicciones de Nominatim:', error);
        // Permitir que el usuario use la entrada como dirección manual
        return of([{
          place_id: 0,
          display_name: input.trim(),
          lat: '0',
          lon: '0',
          type: 'manual'
        }]);
      })
    );
  }

  /**
   * Formatea una dirección para mostrar
   */
  public formatAddress(prediction: AddressPrediction): string {
    return prediction.display_name;
  }

  /**
   * Limpia las predicciones
   */
  public clearPredictions(): void {
    // En esta versión no es necesario
  }

  /**
   * Observable para suscribirse a las predicciones
   */
  public predictions(): Observable<AddressPrediction[]> {
    return of([]);
  }
}
