import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';

export const fetchProjectsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_PROJECTS,
    name: 'Fetch Projects',
    entities: [Entities.PROJECT],
    relationships: [Relationships.ORGANIZATION_HAS_PROJECT],
    dependsOn: [Steps.FETCH_ORGANIZATIONS],
    executionHandler: fetchProjects,
  },
];

export async function fetchProjects({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // TODO
}
