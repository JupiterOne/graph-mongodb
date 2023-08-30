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
