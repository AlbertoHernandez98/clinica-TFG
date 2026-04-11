import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

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

  private predictions$ = new BehaviorSubject<AddressPrediction[]>([]);
  private readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
  private readonly SPAIN_BBOX = '44.36,-9.30,36.00,-2.50'; // Bounding box de España

  constructor(private http: HttpClient) { }

  /**
   * Obtiene predicciones de direcciones basadas en la entrada del usuario
   * @param input - Texto de entrada del usuario
   * @returns Observable con array de predicciones
   */
  public getPredictions(input: string): Observable<AddressPrediction[]> {
    if (!input || input.length < 3) {
      this.predictions$.next([]);
      return this.predictions$;
    }

    const params = {
      q: input,
      format: 'json',
      addressdetails: '1',
      limit: '8',
      viewbox: this.SPAIN_BBOX,
      bounded: '1',
      'accept-language': 'es'
    };

    // Construir query string manualmente
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${this.NOMINATIM_BASE_URL}?${queryString}`;

    this.http.get<any[]>(url)
      .pipe(
        map((response: any[]) => {
          // Filtrar solo direcciones (no centros de interés)
          return response
            .filter(item => {
              // Incluir tipos de dirección relevantes
              const relevantTypes = ['residential', 'street', 'house', 'building', 'commercial', 'industrial'];
              return relevantTypes.includes(item.type) || item.display_name.includes(',');
            })
            .map(item => ({
              place_id: item.place_id,
              display_name: item.display_name,
              lat: item.lat,
              lon: item.lon,
              type: item.type
            }));
        })
      )
      .subscribe(
        (predictions: AddressPrediction[]) => {
          this.predictions$.next(predictions);
        },
        (error) => {
          console.error('Error obteniendo predicciones:', error);
          this.predictions$.next([]);
        }
      );

    return this.predictions$;
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
    this.predictions$.next([]);
  }

  /**
   * Observable para suscribirse a las predicciones
   */
  public predictions(): Observable<AddressPrediction[]> {
    return this.predictions$.asObservable();
  }
}
