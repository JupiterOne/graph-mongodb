import {
  Entity,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { Team } from '../../types';
import { Entities } from '../constants';
import { createEntityKey } from '../createEntityKeyUtil';

export const createTeamEntity = (organization: Entity, team: Team): Entity =>
  createIntegrationEntity({
    entityData: {
      source: team,
      assign: {
        _key: createEntityKey(Entities.TEAM, team.id),
        _class: Entities.TEAM._class,
        _type: Entities.TEAM._type,
        id: team.id,
        name: team.name,
        displayName: team.name,
        webLink: `https://cloud.mongodb.com/v2#/org/${organization.id}/access/teams/${team.id}`,
      },
    },
  });
