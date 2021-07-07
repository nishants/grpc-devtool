import {  CREATE_PROJECT, LOAD_PROJECT} from './workspace.action.types';
export const createProject = () => {
  return {
    type: CREATE_PROJECT,
  };
};
export const loadProject = () => {
  return {
    type: LOAD_PROJECT,
  };
};
