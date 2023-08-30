import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';

export const fetchKeysSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_KEYS,
    name: 'Fetch Keys',
    entities: [Entities.KEY],
    relationships: [
      Relationships.ORGANIZATION_ASSIGNED_KEY,
      Relationships.PROJECT_ASSIGNED_KEY,
      Relationships.KEY_HAS_ROLE,
    ],
    dependsOn: [Steps.FETCH_ORGANIZATIONS, Steps.FETCH_PROJECTS],
    executionHandler: fetchKeys,
  },
  // TODO: I think it will make sense to have another step for creating/relating keys to roles
];

export async function fetchKeys({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // TODO
}
