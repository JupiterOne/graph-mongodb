import {
  Entity,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { createEntityKey } from '../createEntityKeyUtil';
import { ApiKey, Role } from '../../types';

export const createApiKeyEntity = (apiKey: ApiKey): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: apiKey,
      assign: {
        _key: createEntityKey(Entities.API_KEY, apiKey.id),
        _class: Entities.API_KEY._class,
        _type: Entities.API_KEY._type,
        id: apiKey.id,
        apiKeyId: apiKey.id,
        name: apiKey.publicKey,
        description: apiKey.desc,
        displayName: apiKey.publicKey,
      },
    },
  });
};

type OrgAndProjectIds = {
  projectIds: string[];
  orgIds: string[];
};

export const getUniqueOrgAndProjectIdsFromRoles = (
  roles: Role[],
): OrgAndProjectIds => {
  return roles.reduce(
    (accumulator: OrgAndProjectIds, role) => {
      if (role.orgId) {
        if (!accumulator.orgIds.includes(role.orgId)) {
          accumulator.orgIds.push(role.orgId);
        }
      }
      if (role.groupId) {
        if (!accumulator.projectIds.includes(role.groupId)) {
          accumulator.projectIds.push(role.groupId);
        }
      }
      return accumulator;
    },
    { projectIds: [], orgIds: [] },
  );
};
