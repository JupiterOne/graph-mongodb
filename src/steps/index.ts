import { fetchProjectsSteps } from './fetch-projects';
import { fetchClustersSteps } from './fetch-clusters';
import { fetchUsersSteps } from './fetch-users';
import { fetchTeamsSteps } from './fetch-teams';
import { fetchRolesSteps } from './fetch-roles';
import { fetchOrganizationsSteps } from './fetch-organizations';

const integrationSteps = [
  ...fetchOrganizationsSteps,
  ...fetchProjectsSteps,
  ...fetchClustersSteps,
  ...fetchUsersSteps,
  ...fetchTeamsSteps,
  ...fetchRolesSteps,
];

export { integrationSteps };
