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
        _id: organization.id,
        name: organization.name,
        displayName: organization.name,
        isDeleted: organization.isDeleted,
        website: organization.links.find((link) => link.rel === 'self')?.href,
      },
    },
  });
};
