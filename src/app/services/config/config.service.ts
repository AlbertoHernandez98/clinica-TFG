import { Injectable } from '@angular/core';

/**
 * ConfigService - Centralized configuration for API endpoints and environment settings
 * Replaces hardcoded URLs with configurable values
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  // Primary API (NestJS on port 3000)
  private apiBaseUrl = 'http://localhost:3000';
  
  // Secondary API for clinical/medical features (port 8080)
  private clinicalApiBaseUrl = 'http://localhost:8080';
  
  constructor() { }

  /**
   * Get the base URL for primary API calls
   */
  getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  /**
   * Get the base URL for clinical API calls
   */
  getClinicalApiBaseUrl(): string {
    return this.clinicalApiBaseUrl;
  }

  /**
   * Get the full URL for a specific endpoint on primary API
   * @param endpoint API endpoint (e.g., '/persona', '/servicio')
   */
  getApiUrl(endpoint: string): string {
    return `${this.apiBaseUrl}${endpoint}`;
  }

  /**
   * Get the full URL for a specific endpoint on clinical API
   * @param endpoint API endpoint (e.g., '/historialclinico', '/persona')
   */
  getClinicalApiUrl(endpoint: string): string {
    return `${this.clinicalApiBaseUrl}${endpoint}`;
  }
}
