import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';

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
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // TODO
}
