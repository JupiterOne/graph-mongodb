import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';

export const fetchTenantSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_TENANT,
    name: 'Fetch Tenant',
    entities: [Entities.ORGANIZATION],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchTenant,
  },
];

export async function fetchTenant({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // TODO
}
