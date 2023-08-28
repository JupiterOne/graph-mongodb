import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps: Record<
  | 'FETCH_TENANT'
  | 'FETCH_PROJECTS'
  | 'FETCH_CLUSTERS'
  | 'FETCH_USERS'
  | 'FETCH_TEAMS'
  | 'FETCH_ROLES',
  string
> = {
  FETCH_TENANT: 'fetch-tenant',
  FETCH_PROJECTS: 'fetch-projects',
  FETCH_CLUSTERS: 'fetch-clusters',
  FETCH_USERS: 'fetch-users',
  FETCH_TEAMS: 'fetch-teams',
  FETCH_ROLES: 'fetch-roles',
};

export const Entities: Record<
  'ORGANIZATION' | 'PROJECT' | 'CLUSTER' | 'USER' | 'TEAM' | 'ROLE',
  StepEntityMetadata
> = {
  ORGANIZATION: {
    resourceName: 'Organization',
    _type: 'mongodb_tenant',
    _class: ['Account'],
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
};

export const Relationships: Record<
  | 'ORGANIZATION_HAS_USER'
  | 'TEAM_HAS_USER'
  | 'PROJECT_HAS_CLUSTER'
  | 'ROLE_HAS_PROJECT'
  | 'USER_HAS_ROLE',
  StepRelationshipMetadata
> = {
  ORGANIZATION_HAS_USER: {
    sourceType: Entities.ORGANIZATION._type,
    targetType: Entities.USER._type,
    _type: 'mongodb_tenant_has_user',
    _class: RelationshipClass.HAS,
  },
  TEAM_HAS_USER: {
    sourceType: Entities.TEAM._type,
    targetType: Entities.USER._type,
    _type: 'mongodb_team_has_user',
    _class: RelationshipClass.HAS,
  },
  PROJECT_HAS_CLUSTER: {
    sourceType: Entities.PROJECT._type,
    targetType: Entities.CLUSTER._type,
    _type: 'mongodb_project_has_cluster',
    _class: RelationshipClass.HAS,
  },
  ROLE_HAS_PROJECT: {
    sourceType: Entities.ROLE._type,
    targetType: Entities.PROJECT._type,
    _type: 'mongodb_role_has_project',
    _class: RelationshipClass.HAS,
  },
  USER_HAS_ROLE: {
    sourceType: Entities.USER._type,
    targetType: Entities.ROLE._type,
    _type: 'mongodb_user_has_role',
    _class: RelationshipClass.HAS,
  },
};
