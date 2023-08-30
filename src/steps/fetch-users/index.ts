import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';

export const fetchUsersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [
      Relationships.ORGANIZATION_HAS_USER,
      Relationships.TEAM_HAS_USER,
      // TODO: I think it might make sense to move this to its own step to create/relate the roles
      Relationships.USER_ASSIGNED_ROLE,
    ],
    dependsOn: [Steps.FETCH_ORGANIZATIONS, Steps.FETCH_TEAMS],
    executionHandler: fetchUsers,
  },
];

export async function fetchUsers({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // TODO
}
