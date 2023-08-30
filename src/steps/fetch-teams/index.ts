import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAPIClient } from '../../client';
import { createTeamEntity } from './converters';

export const fetchTeamsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_TEAMS,
    name: 'Fetch Teams',
    entities: [Entities.TEAM],
    relationships: [Relationships.ORGANIZATION_HAS_TEAM],
    dependsOn: [Steps.FETCH_ORGANIZATIONS],
    executionHandler: fetchTeams,
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
      await client.fetchTeams(organizationEntity.id as string, async (team) => {
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
      });
    },
  );
}
