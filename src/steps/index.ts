import { fetchProjectsSteps } from './fetch-projects';
import { fetchClustersSteps } from './fetch-clusters';
import { fetchUsersSteps } from './fetch-users';
import { fetchTeamsSteps } from './fetch-teams';
import { fetchOrganizationsSteps } from './fetch-organizations';
import { fetchApiKeysSteps } from './fetch-api-keys';
import { relateRolesToProjectsSteps } from './relate-roles-to-projects';

const integrationSteps = [
  ...fetchOrganizationsSteps,
  ...fetchProjectsSteps,
  ...fetchClustersSteps,
  ...fetchUsersSteps,
  ...fetchTeamsSteps,
  ...fetchApiKeysSteps,
  ...relateRolesToProjectsSteps,
];

export { integrationSteps };
