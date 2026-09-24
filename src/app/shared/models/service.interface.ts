/**
 * Categorías de servicios disponibles
 */
export enum ServiceCategory {
  QUIROPODIA = 'quiropodia',
  BIOMECANICA = 'biomecanica',
  CIRUGIA_UNGEAL = 'cirugia-ungeal',
  CIRUGIA_OSEA = 'cirugia-osea',
  PIE_DIABETICO = 'pie-diabetico',
  PODOLOGIA_INFANTIL = 'podologia-infantil',
  PODOLOGIA_GERIATRICA = 'podologia-geriatrica',
  SERVICIO_DOMICILIO = 'servicio-domicilio'
}

/**
 * Interfaz para un envío de servicio
 */
export interface IService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
}

/**
 * Interfaz para elemento del breadcrumb
 */
export interface Breadcrumb {
  name: string;
  route: string;
  active: boolean;
}
