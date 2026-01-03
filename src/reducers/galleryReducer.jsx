export const ACTIONS = {
  INIT: 'init',
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete',
  SET_MODE: 'set_mode',
  SET_SELECTED_IMAGE: 'set_selected_image',
};

export const initialState = {
  images: [],
  selectedImage: null,
  mode: 'add',
}

export default function galleryReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT:
      return {
        ...state,
        images: action.payload || [],
      }
    case ACTIONS.ADD:
      const newImage = {
        id: Date.now(),
        createdAt: Date.now(),
        ...action.payload,
      }
      return {
        ...state,
        images: [newImage, ...state.images]
      }
    case ACTIONS.UPDATE:
      return {
        ...state,
        images: state.images.map(img =>
          img.id === action.payload.id
            ? { ...img, ...action.payload }
            : img
        ),
      }
    case ACTIONS.DELETE:
      return {
        ...state,
        images: state.images.filter(
          img => img.id !== action.payload
        ),
      }
    case ACTIONS.SET_MODE:
      return {
        ...state,
        mode: action.payload
      }
    case ACTIONS.SET_SELECTED_IMAGE:
      return {
        ...state,
        selectedImage: action.payload
      }
    default:
      return state;
  }
}