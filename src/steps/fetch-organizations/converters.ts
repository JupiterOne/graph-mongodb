import {
  Entity,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { Organization } from '../../types';
import { Entities } from '../constants';
import { createEntityKey } from '../createEntityKeyUtil';

export const createOrganizationEntity = (
  organization: Organization,
): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: organization,
      assign: {
        _key: createEntityKey(Entities.ORGANIZATION, organization.id),
        _class: Entities.ORGANIZATION._class,
        _type: Entities.ORGANIZATION._type,
        id: organization.id,
        organizationId: organization.id,
        name: organization.name,
        displayName: organization.name,
        isDeleted: organization.isDeleted,
        webLink: `https://cloud.mongodb.com/v2/${organization.id}`,
      },
    },
  });
};
