import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createAPIClient } from '../../client';
import { createClusterEntity } from './converter';

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
  instance,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;

  const client = createAPIClient(config);

  await jobState.iterateEntities(Entities.PROJECT, async (project) => {
    await client.fetchClustersForProject(
      project.id as string,
      async (cluster) => {
        const clusterEntity = await jobState.addEntity(
          createClusterEntity(cluster),
        );
        await jobState.addRelationship(
          createDirectRelationship({
            _class: Relationships.PROJECT_HAS_CLUSTER._class,
            from: project,
            to: clusterEntity,
          }),
        );
      },
    );
  });
}
