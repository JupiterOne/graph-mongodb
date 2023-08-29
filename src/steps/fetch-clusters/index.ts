import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';

export const fetchClustersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_CLUSTERS,
    name: 'Fetch Clusters',
    entities: [Entities.CLUSTER],
    relationships: [Relationships.PROJECT_HAS_CLUSTER],
    dependsOn: [Steps.FETCH_PROJECTS],
    executionHandler: fetchClusters,
  },
];

export async function fetchClusters({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // TODO
}
