type MongoDBLink = {
  href: string;
  rel: string;
};

export type Organization = {
  id: string;
  isDeleted: boolean;
  name: string;
  links: MongoDBLink[];
};

export type Team = {
  id: string;
  name: string;
  links: MongoDBLink[];
};

export type Project = {
  id: string;
  name: string;
  orgId: string;
  clusterCount: number;
  created: string;
  links: MongoDBLink[];
};

export type Cluster = {
  backupEnabled: boolean;
  biConnector: {
    enabled: boolean;
    readPreference: string;
  };
  clusterType: string;
  connectionStrings: {
    standard: string;
    standardSrv: string;
  };
  createDate: string;
  diskSizeGB: number;
  encryptionAtRestProvider: string;
  groupId: string;
  id: string;
  labels: string[];
  mongoDBMajorVersion: string;
  mongoDBVersion: string;
  name: string;
  paused: boolean;
  pitEnabled: boolean;
  replicationSpecs: [
    {
      id: string;
      numShards: number;
      regionConfigs: [
        {
          electableSpecs: {
            instanceSize: string;
          };
          backingProviderName: string;
          priority: number;
          providerName: string;
          regionName: string;
        },
      ];
      zoneName: string;
    },
  ];
  rootCertType: string;
  stateName: string;
  tags: string[];
  terminationProtectionEnabled: boolean;
  versionReleaseSystem: string;
};
