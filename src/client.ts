import {
  IntegrationLogger,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { RequestOptions, request } from 'urllib';

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
  private _requestOptions: RequestOptions = {
    digestAuth: `${this.config.publicKey}:${this.config.privateKey}`,
    headers: {
      Accept: 'application/vnd.atlas.2023-02-01+json',
    },
    contentType: 'json',
  };

  constructor(
    readonly config: IntegrationConfig,
    logger?: IntegrationLogger,
  ) {}

  public async verifyAuthentication(): Promise<void> {
    const { res } = await request(`${this._baseUrl}`, this._requestOptions);
    if (res.statusCode !== 200) {
      throw new IntegrationProviderAuthenticationError({
        endpoint: `${this._baseUrl}`,
        status: res.statusCode,
        statusText: res.statusText,
      });
    }
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
