import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createAPIClient } from '../../client';
import { createOrganizationEntity } from './converters';

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
  instance,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;
  const client = createAPIClient(config);

  await client.iterateOrganizations(async (organization) => {
    await jobState.addEntity(createOrganizationEntity(organization));
  });
}
