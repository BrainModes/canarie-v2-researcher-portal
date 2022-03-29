import { SET_DATASET_LIST, SET_IS_LOGIN, SET_REFRESH_MODAL, } from "./actionTypes";

export const setDatasetCreator = (allDatasetLists) => ({
  type: SET_DATASET_LIST,
  payload: {
    allDatasetLists,
  },
});


export const setRefreshModal = (status) => ({
	type: SET_REFRESH_MODAL,
	payload: status,
});


export const setIsLoginCreator = (isLogin) => ({
	type: SET_IS_LOGIN,
	payload: isLogin,
});