import { combineReducers } from "redux";

import datasetList from "./datasetList";
import isLogin from "./isLogin";
import refreshTokenModal from "./refreshToken";

export default combineReducers({ datasetList, isLogin, refreshTokenModal });
