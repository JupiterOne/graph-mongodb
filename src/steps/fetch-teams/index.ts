import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAPIClient } from '../../client';
import { createTeamEntity } from './converters';
import { createRoleEntity, getIdForRole } from '../fetch-users/converter';
import { createEntityKey } from '../createEntityKeyUtil';

export const fetchTeamsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_TEAMS,
    name: 'Fetch Teams',
    entities: [Entities.TEAM],
    relationships: [Relationships.ORGANIZATION_HAS_TEAM],
    dependsOn: [Steps.FETCH_ORGANIZATIONS, Steps.FETCH_PROJECTS],
    executionHandler: fetchTeams,
  },
  {
    id: Steps.FETCH_TEAM_ROLES,
    name: 'Fetch Team Roles',
    entities: [Entities.ROLE],
    relationships: [
      Relationships.TEAM_HAS_ROLE,
      Relationships.PROJECT_HAS_TEAM,
    ],
    dependsOn: [Steps.FETCH_TEAMS, Steps.FETCH_PROJECTS],
    executionHandler: createAndRelateRolesFromProjectTeams,
  },
];

export async function fetchTeams({
  jobState,
  instance: { config },
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(config);

  await jobState.iterateEntities(
    Entities.ORGANIZATION,
    async (organizationEntity) => {
      await client.iterateTeamsForOrganization(
        organizationEntity.id as string,
        async (team) => {
          const teamEntity = await jobState.addEntity(
            createTeamEntity(organizationEntity, team),
          );
          await jobState.addRelationship(
            createDirectRelationship({
              from: organizationEntity,
              to: teamEntity,
              _class: Relationships.ORGANIZATION_HAS_TEAM._class,
            }),
          );
        },
      );
    },
  );
}

export async function createAndRelateRolesFromProjectTeams({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;
  const client = createAPIClient(config);

  await jobState.iterateEntities(Entities.PROJECT, async (projectEntity) => {
    // for each project, get the teams
    await client.iterateTeamsForProject(
      projectEntity.id as string,
      async (team) => {
        const roles = team.roleNames;
        // Since teams have already been created from orgs, get the original team entity
        const teamEntity = await jobState.findEntity(
          createEntityKey(Entities.TEAM, team.teamId),
        );

        await Promise.all(
          roles.map(async (roleName) => {
            // Check to see if a role entity already exists because it was created from a user
            const { id: roleId } = getIdForRole(
              { roleName },
              { scopeName: 'project', scopeId: projectEntity.id as string },
            );
            let roleEntity = await jobState.findEntity(
              createEntityKey(Entities.ROLE, roleId),
            );

            if (!roleEntity) {
              // Create role entities based on team's roles
              roleEntity = await jobState.addEntity(
                createRoleEntity(
                  { roleName },
                  // Teams only have project level roles, they don't have organization level roles
                  { scopeName: 'project', scopeId: projectEntity.id as string },
                ),
              );
            }

            // If the team entity exists, relate it to the role
            if (teamEntity) {
              await jobState.addRelationship(
                createDirectRelationship({
                  from: teamEntity,
                  to: roleEntity,
                  _class: Relationships.TEAM_HAS_ROLE._class,
                }),
              );
            } else {
              logger.warn(
                'A team was not found for this role; skipping relationship creation',
                {
                  roleName,
                  teamId: team.teamId,
                },
              );
            }
          }),
        );

        // Finally, if the team exists, relate it to the project
        if (teamEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              from: projectEntity,
              to: teamEntity,
              _class: Relationships.PROJECT_HAS_TEAM._class,
            }),
          );
        } else {
          logger.warn(
            'A team was not found for this project; skipping relationship creation',
            {
              projectId: projectEntity.id,
              projectName: projectEntity.name,
            },
          );
        }
      },
    );
  });
}
