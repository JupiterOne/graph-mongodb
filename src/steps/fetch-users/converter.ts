import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Role, User } from '../../types';
import { createEntityKey } from '../createEntityKeyUtil';
import { Entities } from '../constants';

export const createUserEntity = (
  user: User,
  organizationId: string,
): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: createEntityKey(Entities.USER, user.id),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        id: user.id,
        userId: user.id,
        username: user.username,
        email: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        displayName: `${user.firstName} ${user.lastName}`,
        webLink: `https://cloud.mongodb.com/v2#/org/${organizationId}/access/users`,
        lastAuth: parseTimePropertyValue(user.lastAuth),
        createdOn: parseTimePropertyValue(user.createdAt),
        country: user.country,
      },
    },
  });
};

export const createRoleEntity = (
  role: Role,
  scope?: { scopeName: 'org' | 'project'; scopeId: string },
): Entity => {
  const { id, scopeName } = getIdForRole(role, scope);
  return createIntegrationEntity({
    entityData: {
      source: role,
      assign: {
        _key: createEntityKey(Entities.ROLE, id),
        _type: Entities.ROLE._type,
        _class: Entities.ROLE._class,
        id: id,
        roleId: id,
        name: role.roleName,
        displayName: role.roleName,
        privilegeNames: [role.roleName],
        privilegeScope: scopeName,
      },
    },
  });
};

export const getIdForRole = (
  role: Role,
  scope?: { scopeName: 'org' | 'project'; scopeId: string },
): { scopeName: 'org' | 'project' | 'unknown'; id: string } => {
  if (role.orgId || role.groupId) {
    return {
      scopeName: role.orgId ? 'org' : 'project',
      id: `${role.orgId || role.groupId}:${role.roleName}`,
    };
  } else if (role.roleName && scope) {
    return {
      scopeName: scope.scopeName,
      id: `${scope.scopeId}:${role.roleName}`,
    };
  }
  // we should never really get here but just in case
  else if (role.roleName) {
    return {
      scopeName: 'unknown',
      id: `unknown:${role.roleName}`,
    };
  }
  return {
    scopeName: 'unknown',
    id: 'unknown:unknown',
  };
};
