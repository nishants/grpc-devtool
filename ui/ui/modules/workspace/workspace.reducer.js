import { CREATE_PROJECT, LOAD_PROJECT } from './workspace.action.types';

const INITIAL_STATE = {
  showCreateProject: false,
  showLoadProject: false,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_PROJECT:
      return {
        ...state,
        showCreateProject: true,
        showLoadProject: false,
      };

    case LOAD_PROJECT:
      return {
        ...state,
        showCreateProject: false,
        showLoadProject: true,
      };
    default: return state;
  }
};

export default reducer;
