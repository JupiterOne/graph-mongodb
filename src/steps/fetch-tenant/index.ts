import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';

export const fetchTenantSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_TENANT,
    name: 'Fetch Tenant',
    entities: [
      Entities.ORGANIZATION,
      Entities.PROJECT,
      Entities.CLUSTER,
      Entities.USER,
      Entities.TEAM,
      Entities.ROLE,
    ],
    relationships: [
      Relationships.ORGANIZATION_HAS_USER,
      Relationships.TEAM_HAS_USER,
      Relationships.PROJECT_HAS_CLUSTER,
      Relationships.ROLE_HAS_PROJECT,
      Relationships.USER_HAS_ROLE,
    ],
    dependsOn: [],
    executionHandler: fetchTenant,
  },
];

export async function fetchTenant({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // TODO
}
