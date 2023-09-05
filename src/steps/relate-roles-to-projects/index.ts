import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { createEntityKey } from '../createEntityKeyUtil';

export const relateRolesToProjectsSteps: IntegrationStep<IntegrationConfig>[] =
  [
    {
      id: Steps.RELATE_ROLES_TO_PROJECTS,
      name: 'Relate Roles to Projects',
      entities: [],
      relationships: [Relationships.PROJECT_OWNS_ROLE],
      dependsOn: [
        Steps.FETCH_API_KEY_ROLES,
        Steps.FETCH_TEAM_ROLES,
        Steps.FETCH_USER_ROLES,
        Steps.FETCH_PROJECTS,
      ],
      executionHandler: relateRolesToProjects,
    },
  ];

export async function relateRolesToProjects({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(Entities.ROLE, async (roleEntity) => {
    if (roleEntity.privilegeScope === 'project') {
      const projectId = getProjectId(roleEntity.id as string);
      const projectEntity = await jobState.findEntity(
        createEntityKey(Entities.PROJECT, projectId),
      );

      if (projectEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            from: projectEntity,
            to: roleEntity,
            _class: Relationships.PROJECT_OWNS_ROLE._class,
          }),
        );
      } else {
        logger.warn(
          'A project was not found for this project role; skipping relationship creation',
          {
            roleId: roleEntity.id,
            projectId,
          },
        );
      }
    }
  });
}

const getProjectId = (id: string) => {
  const [projectId] = id.split(':');
  return projectId;
};
