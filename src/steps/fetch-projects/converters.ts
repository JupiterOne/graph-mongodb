import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Project } from '../../types';
import { createEntityKey } from '../createEntityKeyUtil';
import { Entities } from '../constants';

export const createProjectEntity = (project: Project): Entity => {
  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _key: createEntityKey(Entities.PROJECT, project.id),
        _class: Entities.PROJECT._class,
        _type: Entities.PROJECT._type,
        id: project.id,
        projectId: project.id,
        name: project.name,
        displayName: project.name,
        clusterCount: project.clusterCount,
        createdOn: parseTimePropertyValue(project.created),
        webLink: `https://cloud.mongodb.com/v2/${project.id}`,
      },
    },
  });
};
