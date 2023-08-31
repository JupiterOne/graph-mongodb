import {
  IntegrationLogger,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import DigestClient from 'digest-fetch';
import { Cluster, Organization, Project, Team } from './types';

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
    const organizations = await this._wrapWithErrorHandling('/orgs');

    await Promise.all(organizations.results.map(iterator));
  }

  public async fetchProjects(
    iterator: ResourceIteratee<Project>,
  ): Promise<void> {
    /* 
    projects and groups are synonymous in MongoDB. See the NOTE in this section https://www.mongodb.com/docs/atlas/reference/api-resources-spec/v2/#tag/Projects/operation/getProject
     */
    const projects = await this._wrapWithErrorHandling('/groups');

    await Promise.all(projects.results.map(iterator));
  }

  public async fetchClustersForProject(
    projectId: string,
    iterator: ResourceIteratee<Cluster>,
  ): Promise<void> {
    const clusters = await this._wrapWithErrorHandling(
      `/groups/${projectId}/clusters`,
    );

    await Promise.all(clusters.results.map(iterator));
  }

  private async _wrapWithErrorHandling(endpoint: string): Promise<any> {
    const response = await this._digestClient.fetch(
      `${this._baseUrl}${endpoint}`,
      this._requestOptions,
    );
    // TODO: handle paging
    const data = await response.json();
    if (data.error === 401) {
      throw new IntegrationProviderAuthenticationError({
        endpoint: `${this._baseUrl}${endpoint}`,
        status: data.error,
        statusText: data?.detail || data.reason || 'Unauthorized',
      });
    } else if (data.error === 400) {
      // TODO: handle other error types
    }
    return data;
  }

  public async fetchTeams(
    orgId: string,
    iterator: ResourceIteratee<Team>,
  ): Promise<void> {
    const teams = await this._wrapWithErrorHandling(`/orgs/${orgId}/teams`);

    await Promise.all(teams.results.map(iterator));
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
