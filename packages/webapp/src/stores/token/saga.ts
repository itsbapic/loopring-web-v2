import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import { getTokenMap, getTokenMapStatus } from "./reducer";
import { getIcon } from "../../utils/swap_utils";
import { CoinInfo, CoinMap } from "@loopring-web/common-resources";
import { AddressMap, GetTokenMapParams, IdMap } from "./interface";
import { PayloadAction } from "@reduxjs/toolkit";

const getTokenMapApi = async <R extends { [key: string]: any }>({
  tokensMap,
  pairs,
  marketArr,
  tokenArr,
}: GetTokenMapParams<R>) => {
  let coinMap: CoinMap<any, CoinInfo<any>> = {};
  let totalCoinMap: CoinMap<any, CoinInfo<any>> = {};
  let tokenMap: any = tokensMap;
  let addressIndex: AddressMap = {};
  let idIndex: IdMap = {};
  Reflect.ownKeys(tokensMap).forEach((key) => {
    const coinInfo = {
      icon: getIcon(key as string, tokensMap),
      name: key as string,
      simpleName: key as string,
      description: "",
      company: "",
    };
    if (!(key as string).startsWith("LP-")) {
      coinMap[key as string] = coinInfo;
    }
    totalCoinMap[key as string] = coinInfo;

    if (pairs[key as string] && pairs[key as string].tokenList) {
      // @ts-ignore
      tokensMap[key].tradePairs = pairs[key as string].tokenList;
    }
    addressIndex = {
      ...addressIndex,
      // @ts-ignore
      [tokensMap[key].address.toLowerCase()]: key as string,
    };
    idIndex = {
      ...idIndex,
      // @ts-ignore
      [tokensMap[key].tokenId]: key as string,
    };
  });
  return {
    data: {
      coinMap,
      totalCoinMap,
      addressIndex,
      idIndex,
      tokenMap,
      marketArray: marketArr,
      marketCoins: tokenArr,
    },
  };
};

export function* getPostsSaga<R extends { [key: string]: any }>({
  payload,
}: PayloadAction<GetTokenMapParams<R>>) {
  try {
    const { tokensMap, marketMap, pairs, marketArr, tokenArr } = payload;
    // @ts-ignore
    const { data } = yield call(getTokenMapApi, {
      tokensMap,
      pairs,
      marketArr,
      tokenArr,
    });

    yield put(getTokenMapStatus({ ...data, marketMap }));
  } catch (err) {
    yield put(getTokenMapStatus(err));
  }
}

export function* tokenInitSaga() {
  yield all([takeLatest(getTokenMap, getPostsSaga)]);
}

export const tokenSaga = [
  fork(tokenInitSaga),
  // fork(tokenPairsSaga),
];

// export function* getPairsSaga({payload}:PayloadAction<{tokenPairs: TokenPairs }>) {
//     try {
//         const {tokenPairs} = payload;
//         const tokenPairsMap =  Reflect.ownKeys(tokenPairs).reduce((prev,key)=>{
//            // @ts-ignore
//             return prev[key as string] =  tokenPairs[key as string].tokenList
//         }, {} )
//
//         yield put(getTokenMapStatus({tokenPairsMap}));
//     } catch (err) {
//         yield put(getAmmMapStatus(err));
//     }
// }
// export function* tokenPairsSaga() {
//     yield all([takeLatest(getTokenPairMap, getPairsSaga)]);
// }
