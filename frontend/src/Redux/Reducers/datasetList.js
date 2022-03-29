import { SET_DATASET_LIST } from "../actionTypes";

export default function (state = [], action) {
  switch (action.type) {
    case SET_DATASET_LIST: {
      const { allDatasetLists } = action.payload;
      return allDatasetLists;
    }
    default:
      return state;
  }
}
