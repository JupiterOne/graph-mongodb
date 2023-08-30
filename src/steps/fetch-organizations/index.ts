import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';

export const fetchOrganizationsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_ORGANIZATIONS,
    name: 'Fetch Organizations',
    entities: [Entities.ORGANIZATION],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchOrganizations,
  },
];

export async function fetchOrganizations({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // TODO
}
