import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosRequestConfig } from "axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ApiClientService {
  private readonly logger = new Logger(ApiClientService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Send a GET request to the specified URL
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(this.httpService.get<T>(url, config));
      return response.data;
    } catch (error) {
      this.handleError(error, "GET", url);
    }
  }

  /**
   * Send a POST request to the specified URL
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(this.httpService.post<T>(url, data, config));
      return response.data;
    } catch (error) {
      this.handleError(error, "POST", url);
    }
  }

  /**
   * Send a PUT request to the specified URL
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(this.httpService.put<T>(url, data, config));
      return response.data;
    } catch (error) {
      this.handleError(error, "PUT", url);
    }
  }

  /**
   * Send a PATCH request to the specified URL
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(this.httpService.patch<T>(url, data, config));
      return response.data;
    } catch (error) {
      this.handleError(error, "PATCH", url);
    }
  }

  /**
   * Send a DELETE request to the specified URL
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await firstValueFrom(this.httpService.delete<T>(url, config));
      return response.data;
    } catch (error) {
      this.handleError(error, "DELETE", url);
    }
  }

  /**
   * Handle Axios error and throw a clear exception
   */
  private handleError(error: any, method: string, url: string): never {
    this.logger.error(
      `Failed to execute ${method} request to ${url}: ${error.message}`,
      error.stack,
    );
    if (error.response) {
      try {
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
        this.logger.error(`Response status: ${error.response.status}`);
        this.logger.error(`Response headers: ${JSON.stringify(error.response.headers)}`);
      } catch (e) {
        this.logger.error(`Could not log response details: ${e.message}`);
      }
    } else if (error.request) {
      this.logger.error(
        "No response received from request. This usually indicates a network error, DNS failure, or the target service is not running.",
      );
    }
    throw error;
  }
}
