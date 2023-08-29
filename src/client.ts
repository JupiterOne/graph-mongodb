import {
  IntegrationLogger,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import DigestClient from 'digest-fetch';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  private _baseUrl: string = 'https://cloud.mongodb.com/api/atlas/v2';
  private _requestOptions = {
    headers: {
      Accept: 'application/vnd.atlas.2023-02-01+json',
      'Content-Type': 'application/json',
    },
  };
  private _digestClient: DigestClient;

  constructor(
    readonly config: IntegrationConfig,
    logger?: IntegrationLogger,
  ) {
    this._digestClient = new DigestClient(
      this.config.publicKey,
      this.config.privateKey,
    );
  }

  public async verifyAuthentication(): Promise<void> {
    await this._digestClient
      .fetch(`${this._baseUrl}`, this._requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new IntegrationProviderAuthenticationError({
            endpoint: `${this._baseUrl}`,
            status: data.error,
            statusText: data?.detail || data.reason || 'Unauthorized',
          });
        }
      });
    return Promise.resolve();
  }
}

let client: APIClient;

export function createAPIClient(config: IntegrationConfig): APIClient {
  if (
    !client ||
    client.config.publicKey !== config.publicKey ||
    client.config.privateKey !== config.privateKey
  ) {
    client = new APIClient(config);
  }
  return client;
}
