import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export const createEntityKey = (
  entityMetadata: StepEntityMetadata,
  id: string,
) => {
  return `${entityMetadata._type}:${id}`;
};
