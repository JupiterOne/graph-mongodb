import { parseTimePropertyValue } from '@jupiterone/integration-sdk-core';
import { Project } from '../../types';
import { createProjectEntity } from './converters';
import { Entities } from '../constants';

describe('createProjectEntity', () => {
  const mockProject: Project = {
    id: '729347',
    name: 'jupiterone',
    orgId: 'mongo-db-org-id-0922',
    clusterCount: 1,
    created: String(new Date('August 30, 2023')),
    links: [],
  };

  test('creates a project integration entity', () => {
    expect(createProjectEntity(mockProject)).toEqual({
      _class: Entities.PROJECT._class,
      _key: 'mongodb_project:729347',
      _type: Entities.PROJECT._type,
      createdOn: parseTimePropertyValue(mockProject.created),
      displayName: mockProject.name,
      id: mockProject.id,
      name: mockProject.name,
      webLink: `https://cloud.mongodb.com/v2/${mockProject.id}`,
      projectId: mockProject.id,
      clusterCount: 1,
      _rawData: [{ name: 'default', rawData: mockProject }],
    });
  });
});
