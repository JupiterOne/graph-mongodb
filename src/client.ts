import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import DigestClient from 'digest-fetch';
import {
  Cluster,
  Organization,
  Project,
  OrganizationTeam,
  User,
  ProjectTeam,
  ApiKey,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * Sample error response: 
 * {
  "detail": "(This is just an example, the exception may not be related to this endpoint) No provider AWS exists.",
  "error": 400,
  "errorCode": "INVALID_PROVIDER",
  "parameters": [
    "AWS"
  ],
  "reason": "Bad Request"
}
 */
type ErrorResponse = {
  error: 400 | 401 | 404 | 409 | 500;
  detail: string;
  errorCode: string;
  reason: string;
};

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

  public async iterateOrganizations(
    iterator: ResourceIteratee<Organization>,
  ): Promise<void> {
    await this._wrapWithErrorHandling('/orgs', iterator);
  }

  public async iterateProjects(
    iterator: ResourceIteratee<Project>,
  ): Promise<void> {
    /* 
    projects and groups are synonymous in MongoDB. See the NOTE in this section https://www.mongodb.com/docs/atlas/reference/api-resources-spec/v2/#tag/Projects/operation/getProject
     */
    await this._wrapWithErrorHandling('/groups', iterator);
  }

  public async iterateClustersForProject(
    projectId: string,
    iterator: ResourceIteratee<Cluster>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(
      `/groups/${projectId}/clusters`,
      iterator,
    );
  }

  public async iterateUsersForOrganization(
    organizationId: string,
    iterator: ResourceIteratee<User>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(
      `/orgs/${organizationId}/users`,
      iterator,
    );
  }

  public async iterateUsersForProject(
    projectId: string,
    iterator: ResourceIteratee<User>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(`/groups/${projectId}/users`, iterator);
  }

  public async iterateTeamsForOrganization(
    orgId: string,
    iterator: ResourceIteratee<OrganizationTeam>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(`/orgs/${orgId}/teams`, iterator);
  }

  public async iterateTeamsForProject(
    projectId: string,
    iterator: ResourceIteratee<ProjectTeam>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(`/groups/${projectId}/teams`, iterator);
  }

  public async iterateApiKeysForOrganization(
    organizationId: string,
    iterator: ResourceIteratee<ApiKey>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(
      `/orgs/${organizationId}/apiKeys`,
      iterator,
    );
  }

  private async _wrapWithErrorHandling<T>(
    endpoint: string,
    iterator: ResourceIteratee<T>,
  ): Promise<any> {
    let pageNumber: number = 1;
    let totalCount: number = 0;
    let seenCount: number = 0;

    do {
      const response = await this._digestClient.fetch(
        // Items per page can go up to 500 but we'll keep it at 100 since that is the default
        `${this._baseUrl}${endpoint}?pageNum=${pageNumber}&itemsPerPage=100`,
        this._requestOptions,
      );

      const data = await response.json();

      if (data.error) {
        this._handleErrorResponse(data, endpoint);
      }

      totalCount = data.totalCount;
      seenCount += data.results.length;
      if (totalCount > seenCount) pageNumber++;

      await Promise.all(data.results.map(iterator));
    } while (totalCount > seenCount);
  }

  private _handleErrorResponse(errorResponse: ErrorResponse, endpoint: string) {
    const { error, errorCode, reason, detail } = errorResponse;
    switch (errorResponse.error) {
      case 401:
        throw new IntegrationProviderAuthenticationError({
          endpoint: `${this._baseUrl}${endpoint}`,
          status: error,
          // Ex: "INVALID_PROVIDER: Bad Request. No provider AWS exists."
          statusText: `${errorCode}: ${reason}. ${detail}`,
        });
      case 400:
      case 404:
      case 409:
      case 500:
        throw new IntegrationProviderAPIError({
          code: errorCode,
          endpoint: `${this._baseUrl}${endpoint}`,
          status: error,
          statusText: `${errorCode}: ${reason}. ${detail}`,
        });
      default:
        throw new IntegrationProviderAPIError({
          code: errorCode || 'UNKNOWN',
          endpoint: `${this._baseUrl}${endpoint}`,
          status: error || 'UNKNOWN',
          statusText: `An unexpected error occurred`,
        });
    }
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
