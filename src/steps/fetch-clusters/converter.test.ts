import { Cluster } from '../../types';
import { createClusterEntity } from './converter';

describe('createClusterEntity', () => {
  const mockCluster: Cluster = {
    backupEnabled: false,
    biConnector: {
      enabled: false,
      readPreference: 'secondary',
    },
    clusterType: 'REPLICASET',
    connectionStrings: {
      standard:
        'mongodb://ac-c3pshpd-shard-00-00.kv1hror.mongodb.net:27017,ac-c3pshpd-shard-00-01.kv1hror.mongodb.net:27017,ac-c3pshpd-shard-00-02.kv1hror.mongodb.net:27017/?ssl=true&authSource=admin&replicaSet=atlas-74h4qi-shard-0',
      standardSrv: 'mongodb+srv://cluster0.kv1hror.mongodb.net',
    },
    createDate: String(new Date('August 30, 2023')),
    diskSizeGB: 0.5,
    encryptionAtRestProvider: 'NONE',
    groupId: '729347',
    id: '209849',
    labels: [
      {
        key: 'environment',
        value: 'production',
      },
    ],
    mongoDBMajorVersion: '6.0',
    mongoDBVersion: '6.0.9',
    name: 'Cluster0',
    paused: false,
    pitEnabled: false,
    replicationSpecs: [
      {
        id: '0982340-1-4434',
        numShards: 1,
        regionConfigs: [
          {
            electableSpecs: {
              instanceSize: 'M10',
            },
            backingProviderName: 'AWS',
            priority: 7,
            providerName: 'TENANT',
            regionName: 'US_EAST_1',
          },
        ],
        zoneName: 'Zone 1',
      },
    ],
    rootCertType: 'ISRGROOTX1',
    stateName: 'IDLE',
    tags: [
      {
        key: 'application',
        value: 'jupiterone',
      },
    ],
    terminationProtectionEnabled: false,
    versionReleaseSystem: 'LTS',
  };
  test('creates a cluster integration entity', () => {
    const mockClusterEntity = createClusterEntity(mockCluster);
    expect(mockClusterEntity).toEqual(
      expect.objectContaining({
        _class: ['Cluster'],
        _key: 'mongodb_cluster:209849',
        _type: 'mongodb_cluster',
      }),
    );

    // the values in these properties will be used to actually tag the entities in J1, rather than applied as properties
    expect(mockClusterEntity).toEqual(
      expect.not.objectContaining({
        tags: expect.anything(),
        labels: expect.anything(),
      }),
    );
  });
});
