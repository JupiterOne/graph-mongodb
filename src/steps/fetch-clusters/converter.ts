import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { createEntityKey } from '../createEntityKeyUtil';
import { Entities } from '../constants';
import { Cluster } from '../../types';

export const createClusterEntity = (cluster: Cluster): Entity => {
  return createIntegrationEntity({
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
        labels: cluster.labels,
        mongoDBVersion: cluster.mongoDBVersion,
        paused: cluster.paused,
        pitEnabled: cluster.pitEnabled,
        backupEnabled: cluster.backupEnabled,
        createdOn: parseTimePropertyValue(cluster.createDate),
        encryptionAtRestProvider: cluster.encryptionAtRestProvider,
        diskSizeGB: cluster.diskSizeGB,
        tags: cluster.tags,
        terminationProtectionEnabled: cluster.terminationProtectionEnabled,
        webLink: `https://cloud.mongodb.com/v2/${cluster.groupId}#/clusters/detail/${cluster.name}`,
      },
    },
  });
};
