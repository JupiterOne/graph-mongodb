import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAPIClient } from '../../client';
import { createRoleEntity, createUserEntity, getIdForRole } from './converter';
import { createEntityKey } from '../createEntityKeyUtil';

export const fetchUsersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [
      Relationships.ORGANIZATION_HAS_USER,
      Relationships.TEAM_HAS_USER,
    ],
    dependsOn: [Steps.FETCH_ORGANIZATIONS, Steps.FETCH_TEAMS],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.FETCH_USER_ROLES,
    name: 'Fetch User Roles',
    entities: [Entities.ROLE],
    relationships: [Relationships.USER_ASSIGNED_ROLE],
    dependsOn: [Steps.FETCH_USERS],
    executionHandler: createAndRelateRoles,
  },
];

export async function fetchUsers({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = createAPIClient(config);

  await jobState.iterateEntities(
    Entities.ORGANIZATION,
    async (organizationEntity) => {
      await client.iterateUsersForOrganization(
        organizationEntity.id as string,
        async (user) => {
          const userEntity = await jobState.addEntity(
            createUserEntity(user, organizationEntity.id as string),
          );

          // Create relationship between user and organization
          await jobState.addRelationship(
            createDirectRelationship({
              _class: Relationships.ORGANIZATION_HAS_USER._class,
              from: organizationEntity,
              to: userEntity,
            }),
          );

          // Create relationship between user and team(s)
          const teamIds = user.teamIds;
          await Promise.all(
            teamIds.map(async (teamId) => {
              const teamEntity = await jobState.findEntity(
                createEntityKey(Entities.TEAM, teamId),
              );

              if (teamEntity) {
                await jobState.addRelationship(
                  createDirectRelationship({
                    _class: Relationships.TEAM_HAS_USER._class,
                    from: teamEntity,
                    to: userEntity,
                  }),
                );
              } else {
                logger.warn(
                  "User's team was not found and the relationship was not created",
                  { teamId, userId: user.id, username: user.username },
                );
              }
            }),
          );
        },
      );
    },
  );
}

export async function createAndRelateRoles({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(Entities.USER, async (userEntity) => {
    const roles = userEntity._rawData?.[0].rawData['roles'] || [];
    await Promise.all(
      roles.map(async (role) => {
        const { id: roleId } = getIdForRole(role);
        const existingRoleEntity = await jobState.findEntity(
          createEntityKey(Entities.ROLE, roleId),
        );

        if (existingRoleEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: Relationships.USER_ASSIGNED_ROLE._class,
              from: userEntity,
              to: existingRoleEntity,
            }),
          );
        } else {
          const roleEntity = await jobState.addEntity(createRoleEntity(role));
          await jobState.addRelationship(
            createDirectRelationship({
              _class: Relationships.USER_ASSIGNED_ROLE._class,
              from: userEntity,
              to: roleEntity,
            }),
          );
        }
      }),
    );
  });
}
