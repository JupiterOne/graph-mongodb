import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAPIClient } from '../../client';
import { createProjectEntity } from './converters';
import { createEntityKey } from '../createEntityKeyUtil';

export const fetchProjectsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_PROJECTS,
    name: 'Fetch Projects',
    entities: [Entities.PROJECT],
    relationships: [Relationships.ORGANIZATION_HAS_PROJECT],
    dependsOn: [Steps.FETCH_ORGANIZATIONS],
    executionHandler: fetchProjects,
  },
  {
    id: Steps.RELATE_USERS_TO_PROJECTS,
    name: 'Relate Users to Projects',
    entities: [Entities.PROJECT],
    relationships: [Relationships.PROJECT_HAS_USER],
    dependsOn: [Steps.FETCH_USERS, Steps.FETCH_PROJECTS],
    executionHandler: relateUsersToProjects,
  },
];

export async function fetchProjects({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = createAPIClient(config);

  await client.fetchProjects(async (project) => {
    const projectEntity = await jobState.addEntity(
      createProjectEntity(project),
    );
    const organizationEntity = await jobState.findEntity(
      createEntityKey(Entities.ORGANIZATION, project.orgId),
    );

    if (organizationEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          from: organizationEntity,
          to: projectEntity,
          _class: Relationships.ORGANIZATION_HAS_PROJECT._class,
        }),
      );
    } else {
      logger.warn(
        `An organization was not found for the project with ID ${project.id} and a relationship to the organization was not created.`,
      );
    }
  });
}

export async function relateUsersToProjects({
  jobState,
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = createAPIClient(config);

  await jobState.iterateEntities(Entities.PROJECT, async (projectEntity) => {
    await client.fetchUsersForProject(
      projectEntity.id as string,
      async (user) => {
        const userEntity = await jobState.findEntity(
          createEntityKey(Entities.USER, user.id),
        );

        if (userEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              from: projectEntity,
              to: userEntity,
              _class: Relationships.PROJECT_HAS_USER._class,
            }),
          );
        } else {
          logger.warn(
            `A user with id ${user.id} was not found; skipping relationship creation to project`,
            {
              userId: user.id,
              projectId: projectEntity.id,
            },
          );
        }
      },
    );
  });
}
