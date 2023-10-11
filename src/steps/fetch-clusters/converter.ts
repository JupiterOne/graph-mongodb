import {
  Entity,
  assignTags,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { createEntityKey } from '../createEntityKeyUtil';
import { Entities } from '../constants';
import { Cluster } from '../../types';

export const createClusterEntity = (cluster: Cluster): Entity => {
  const clusterEntity = createIntegrationEntity({
    entityData: {
      source: cluster,
      assign: {
        _key: createEntityKey(Entities.CLUSTER, cluster.id),
        _class: Entities.CLUSTER._class,
        _type: Entities.CLUSTER._type,
        id: cluster.id,
        clusterId: cluster.id,
        name: cluster.name,
        displayName: cluster.name,
        projectId: cluster.groupId,
        mongoDBVersion: cluster.mongoDBVersion,
        paused: cluster.paused,
        pitEnabled: cluster.pitEnabled,
        backupEnabled: cluster.backupEnabled,
        createdOn: parseTimePropertyValue(cluster.createDate),
        encryptionAtRestProvider: cluster.encryptionAtRestProvider,
        diskSizeGB: cluster.diskSizeGB,
        terminationProtectionEnabled: cluster.terminationProtectionEnabled,
        webLink: `https://cloud.mongodb.com/v2/${cluster.groupId}#/clusters/detail/${cluster.name}`,
      },
    },
  });

  assignTags(clusterEntity, cluster.tags);
  // Labels will be deprecated soon, but will be treating them as tags for now: https://www.mongodb.com/docs/atlas/tags/#:~:text=Cluster%20labels%20will%20be%20deprecated%20in%20a%20future%20release.%20We%20strongly%20recommend%20that%20you%20use%20resource%20tags%20instead.
  assignTags(clusterEntity, cluster.labels);
  return clusterEntity;
};
