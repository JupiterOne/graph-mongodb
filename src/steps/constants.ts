import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps: Record<
  | 'FETCH_ORGANIZATIONS'
  | 'FETCH_PROJECTS'
  | 'FETCH_CLUSTERS'
  | 'FETCH_USERS'
  | 'FETCH_TEAMS'
  | 'FETCH_KEYS'
  | 'CREATE_ROLES_FROM_USERS'
  | 'CREATE_ROLES_FROM_TEAMS',
  string
> = {
  FETCH_ORGANIZATIONS: 'fetch-organizations',
  FETCH_PROJECTS: 'fetch-projects',
  FETCH_CLUSTERS: 'fetch-clusters',
  FETCH_USERS: 'fetch-users',
  FETCH_TEAMS: 'fetch-teams',
  FETCH_KEYS: 'fetch-keys',
  CREATE_ROLES_FROM_USERS: 'create-roles-from-users',
  CREATE_ROLES_FROM_TEAMS: 'create-roles-from-teams',
};

export const Entities: Record<
  'ORGANIZATION' | 'PROJECT' | 'CLUSTER' | 'USER' | 'TEAM' | 'ROLE' | 'KEY',
  StepEntityMetadata
> = {
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'mongodb_organization',
    _class: ['Organization'],
  },
  PROJECT: {
    resourceName: 'Project',
    _type: 'mongodb_project',
    _class: ['Project'],
  },
  CLUSTER: {
    resourceName: 'Cluster',
    _type: 'mongodb_cluster',
    _class: ['Cluster'],
  },
  USER: {
    resourceName: 'User',
    _type: 'mongodb_user',
    _class: ['User'],
  },
  TEAM: {
    resourceName: 'Team',
    _type: 'mongodb_team',
    _class: ['UserGroup', 'Team'],
  },
  ROLE: {
    resourceName: 'Role',
    _type: 'mongodb_role',
    _class: ['AccessRole'],
  },
  KEY: {
    resourceName: 'Key',
    _type: 'mongodb_key',
    _class: ['AccessKey'],
  },
};

export const Relationships: Record<
  | 'ORGANIZATION_HAS_USER'
  | 'ORGANIZATION_HAS_PROJECT'
  | 'ORGANIZATION_HAS_TEAM'
  | 'ORGANIZATION_ASSIGNED_KEY'
  | 'TEAM_HAS_USER'
  | 'TEAM_HAS_ROLE'
  | 'PROJECT_HAS_CLUSTER'
  | 'PROJECT_HAS_TEAM'
  | 'PROJECT_HAS_USER'
  | 'PROJECT_OWNS_ROLE'
  | 'PROJECT_ASSIGNED_KEY'
  | 'USER_ASSIGNED_ROLE'
  | 'KEY_HAS_ROLE',
  StepRelationshipMetadata
> = {
  ORGANIZATION_HAS_USER: {
    sourceType: Entities.ORGANIZATION._type,
    targetType: Entities.USER._type,
    _type: 'mongodb_organization_has_user',
    _class: RelationshipClass.HAS,
  },
  ORGANIZATION_HAS_PROJECT: {
    sourceType: Entities.ORGANIZATION._type,
    targetType: Entities.PROJECT._type,
    _type: 'mongodb_organization_has_project',
    _class: RelationshipClass.HAS,
  },
  ORGANIZATION_HAS_TEAM: {
    sourceType: Entities.ORGANIZATION._type,
    targetType: Entities.TEAM._type,
    _type: 'mongodb_organization_has_team',
    _class: RelationshipClass.HAS,
  },
  ORGANIZATION_ASSIGNED_KEY: {
    sourceType: Entities.ORGANIZATION._type,
    targetType: Entities.KEY._type,
    _type: 'mongodb_organization_assigned_key',
    _class: RelationshipClass.ASSIGNED,
  },
  TEAM_HAS_USER: {
    sourceType: Entities.TEAM._type,
    targetType: Entities.USER._type,
    _type: 'mongodb_team_has_user',
    _class: RelationshipClass.HAS,
  },
  TEAM_HAS_ROLE: {
    sourceType: Entities.TEAM._type,
    targetType: Entities.ROLE._type,
    _type: 'mongodb_team_has_role',
    _class: RelationshipClass.HAS,
  },
  PROJECT_HAS_CLUSTER: {
    sourceType: Entities.PROJECT._type,
    targetType: Entities.CLUSTER._type,
    _type: 'mongodb_project_has_cluster',
    _class: RelationshipClass.HAS,
  },
  PROJECT_HAS_USER: {
    sourceType: Entities.PROJECT._type,
    targetType: Entities.USER._type,
    _type: 'mongodb_project_has_user',
    _class: RelationshipClass.HAS,
  },
  PROJECT_HAS_TEAM: {
    sourceType: Entities.PROJECT._type,
    targetType: Entities.TEAM._type,
    _type: 'mongodb_project_has_team',
    _class: RelationshipClass.HAS,
  },
  PROJECT_OWNS_ROLE: {
    sourceType: Entities.PROJECT._type,
    targetType: Entities.ROLE._type,
    _type: 'mongodb_project_owns_role',
    _class: RelationshipClass.OWNS,
  },
  PROJECT_ASSIGNED_KEY: {
    sourceType: Entities.PROJECT._type,
    targetType: Entities.KEY._type,
    _type: 'mongodb_project_assigned_key',
    _class: RelationshipClass.ASSIGNED,
  },
  USER_ASSIGNED_ROLE: {
    sourceType: Entities.USER._type,
    targetType: Entities.ROLE._type,
    _type: 'mongodb_user_assigned_role',
    _class: RelationshipClass.ASSIGNED,
  },
  KEY_HAS_ROLE: {
    sourceType: Entities.KEY._type,
    targetType: Entities.ROLE._type,
    _type: 'mongodb_key_has_role',
    _class: RelationshipClass.HAS,
  },
};
