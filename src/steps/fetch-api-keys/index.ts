import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAPIClient } from '../../client';
import {
  createApiKeyEntity,
  getUniqueOrgAndProjectIdsFromRoles,
} from './converters';
import { createRoleEntity, getIdForRole } from '../fetch-users/converter';
import { createEntityKey } from '../createEntityKeyUtil';

export const fetchApiKeysSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_API_KEYS,
    name: 'Fetch API Keys',
    entities: [Entities.API_KEY],
    relationships: [
      Relationships.ORGANIZATION_HAS_API_KEY,
      Relationships.PROJECT_HAS_API_KEY,
    ],
    dependsOn: [Steps.FETCH_ORGANIZATIONS, Steps.FETCH_PROJECTS],
    executionHandler: fetchApiKeys,
  },
  {
    id: Steps.FETCH_API_KEY_ROLES,
    name: 'Fetch API Key Roles',
    entities: [Entities.ROLE],
    relationships: [Relationships.API_KEY_HAS_ROLE],
    dependsOn: [Steps.FETCH_API_KEYS],
    executionHandler: createAndRelateRolesFromApiKeys,
  },
];

export async function fetchApiKeys({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = createAPIClient(config);

  await jobState.iterateEntities(
    Entities.ORGANIZATION,
    async (organizationEntity) => {
      await client.iterateApiKeysForOrganization(
        organizationEntity.id as string,
        async (apiKey) => {
          // create API key entity
          const apiKeyEntity = await jobState.addEntity(
            createApiKeyEntity(apiKey),
          );

          const uniqueOrgAndProjectIds = getUniqueOrgAndProjectIdsFromRoles(
            apiKey.roles,
          );

          // create relationships to organizations via roles the api key has
          await Promise.all(
            uniqueOrgAndProjectIds.orgIds.map(async (orgId) => {
              const roleOrganizationEntity = await jobState.findEntity(
                createEntityKey(Entities.ORGANIZATION, orgId),
              );

              if (roleOrganizationEntity) {
                await jobState.addRelationship(
                  createDirectRelationship({
                    from: roleOrganizationEntity,
                    to: apiKeyEntity,
                    _class: Relationships.ORGANIZATION_HAS_API_KEY._class,
                  }),
                );
              } else {
                logger.warn(
                  'An organization was not found for this api key role; skipping relationship creation',
                  {
                    apiKeyName: apiKey.publicKey,
                    orgId,
                  },
                );
              }
            }),
          );

          // create relationships to projects via roles the api key has
          await Promise.all(
            uniqueOrgAndProjectIds.projectIds.map(async (projectId) => {
              const projectEntity = await jobState.findEntity(
                createEntityKey(Entities.PROJECT, projectId),
              );

              if (projectEntity) {
                await jobState.addRelationship(
                  createDirectRelationship({
                    from: projectEntity,
                    to: apiKeyEntity,
                    _class: Relationships.PROJECT_HAS_API_KEY._class,
                  }),
                );
              } else {
                logger.warn(
                  'A project was not found for this api key role; skipping relationship creation',
                  {
                    apiKeyName: apiKey.publicKey,
                    projectId,
                  },
                );
              }
            }),
          );
        },
      );
    },
  );
}

export async function createAndRelateRolesFromApiKeys({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(Entities.API_KEY, async (apiKeyEntity) => {
    const roles = apiKeyEntity._rawData?.[0].rawData['roles'] || [];
    await Promise.all(
      roles.map(async (role) => {
        const { id: roleId } = getIdForRole(role);
        const existingRoleEntity = await jobState.findEntity(
          createEntityKey(Entities.ROLE, roleId),
        );

        if (existingRoleEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: Relationships.API_KEY_HAS_ROLE._class,
              from: apiKeyEntity,
              to: existingRoleEntity,
            }),
          );
        } else {
          const roleEntity = await jobState.addEntity(createRoleEntity(role));
          await jobState.addRelationship(
            createDirectRelationship({
              _class: Relationships.API_KEY_HAS_ROLE._class,
              from: apiKeyEntity,
              to: roleEntity,
            }),
          );
        }
      }),
    );
  });
}
