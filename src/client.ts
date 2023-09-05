import {
  IntegrationLogger,
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

  public async fetchOrganizations(
    iterator: ResourceIteratee<Organization>,
  ): Promise<void> {
    await this._wrapWithErrorHandling('/orgs', iterator);
  }

  public async fetchProjects(
    iterator: ResourceIteratee<Project>,
  ): Promise<void> {
    /* 
    projects and groups are synonymous in MongoDB. See the NOTE in this section https://www.mongodb.com/docs/atlas/reference/api-resources-spec/v2/#tag/Projects/operation/getProject
     */
    await this._wrapWithErrorHandling('/groups', iterator);
  }

  public async fetchClustersForProject(
    projectId: string,
    iterator: ResourceIteratee<Cluster>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(
      `/groups/${projectId}/clusters`,
      iterator,
    );
  }

  public async fetchUsersForOrganization(
    organizationId: string,
    iterator: ResourceIteratee<User>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(
      `/orgs/${organizationId}/users`,
      iterator,
    );
  }

  public async fetchUsersForProject(
    projectId: string,
    iterator: ResourceIteratee<User>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(`/groups/${projectId}/users`, iterator);
  }

  public async fetchTeamsForOrganization(
    orgId: string,
    iterator: ResourceIteratee<OrganizationTeam>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(`/orgs/${orgId}/teams`, iterator);
  }

  public async fetchTeamsForProject(
    projectId: string,
    iterator: ResourceIteratee<ProjectTeam>,
  ): Promise<void> {
    await this._wrapWithErrorHandling(`/groups/${projectId}/teams`, iterator);
  }

  public async fetchApiKeysForOrganization(
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
        console.log(data.error);
        // TODO: implement _handleErrorResponse()
      }

      totalCount = data.totalCount;
      seenCount += data.results.length;
      if (totalCount > seenCount) pageNumber++;

      await Promise.all(data.results.map(iterator));
    } while (totalCount > seenCount);
  }

  // TODO: handle error responses
  private async _handleErrorResponse(response) {
    //   //   if (data.error === 401) {
    //   //   throw new IntegrationProviderAuthenticationError({
    //   //     endpoint: `${this._baseUrl}${endpoint}`,
    //   //     status: data.error,
    //   //     statusText: data?.detail || data.reason || 'Unauthorized',
    //   //   });
    //   // } else if (data.error === 400) {
    //   //   // TODO: handle other error types
    //   // }
    // }
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
