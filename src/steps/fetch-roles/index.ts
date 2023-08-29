import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';

export const fetchRolesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_ROLES,
    name: 'Fetch Roles',
    entities: [Entities.ROLE],
    relationships: [Relationships.PROJECT_HAS_ROLE],
    dependsOn: [Steps.FETCH_PROJECTS],
    executionHandler: fetchRoles,
  },
];

export async function fetchRoles({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // TODO
}
