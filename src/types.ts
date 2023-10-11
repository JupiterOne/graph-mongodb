import { ResourceTagList } from '@jupiterone/integration-sdk-core';

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

export type OrganizationTeam = {
  id: string;
  name: string;
  links: MongoDBLink[];
};

// The distinction between OrganizationTeam and ProjectTeam is pretty small but we do need both types
export type ProjectTeam = {
  teamId: string;
  roleNames: string[];
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
  labels: ResourceTagList;
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
  tags: ResourceTagList;
  terminationProtectionEnabled: boolean;
  versionReleaseSystem: string;
};

export type User = {
  id: string;
  country: string;
  createdAt: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  lastAuth: string;
  links: MongoDBLink[];
  mobileNumber: string;
  teamIds: string[];
  username: string;
  roles: Role[];
};

export type Role = {
  orgId?: string;
  groupId?: string;
  roleName: string;
};

export type ApiKey = {
  id: string;
  desc: string;
  roles: Role[];
  // private key is redacted by the API
  privateKey: string;
  publicKey: string;
  links: MongoDBLink[];
};
