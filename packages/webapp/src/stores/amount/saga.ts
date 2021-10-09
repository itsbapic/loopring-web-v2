import { all, call, fork, put, takeLatest } from "redux-saga/effects"
import { getAmount, getAmountStatus, resetAmount } from './reducer'

import store from '../index';
import { LoopringAPI } from 'api_wrapper';
import * as sdk from 'loopring-sdk';

const getAmountApi = async <R extends { [ key: string ]: any }>(market: string): Promise<{
    newAmountMap: object | undefined,
    __timer__: NodeJS.Timer | -1
}> => {

    const {accountId, apiKey} = store.getState().account
    let {__timerMap__} = store.getState().amountMap;
    let __timer__ = (__timerMap__ && __timerMap__[ market ]) ? __timerMap__[ market ] : -1;

    if (LoopringAPI.userAPI && accountId && apiKey) {
        // __timer__ = ((__timer__, market) => {
        if (__timer__ && __timer__ !== -1) {
            clearInterval(__timer__);
        }
        __timer__ = setInterval(async () => {
            store.dispatch(getAmount(market))
        }, 1000 * 15 * 60)//   //

        // })(__timer__, market);
        const req: sdk.GetMinimumTokenAmtRequest = {
            accountId: accountId,
            market: market,
        }
        const {amountMap: _pairMap} = await LoopringAPI.userAPI.getMinimumTokenAmt(req, apiKey)
        const reqAmm: sdk.GetMinimumTokenAmtRequest = {
            accountId: accountId,
            market: 'AMM-' + market,
        }
        const {amountMap: _pairMapAmm} = await LoopringAPI.userAPI.getMinimumTokenAmt(reqAmm, apiKey)
        return {newAmountMap: {[ market ]: _pairMap, [ 'AMM-' + market ]: _pairMapAmm}, __timer__}

    } else {
        if (__timer__ && __timer__ !== -1) {
            clearInterval(__timer__);
        }
        return Promise.resolve({newAmountMap: {}, __timer__: -1})
    }

}

export function* getPostsSaga({payload: {market}}: any) {
    try {

        const {amountMap, __timerMap__} = store.getState().amountMap;
        if (market) {
            const {newAmountMap, __timer__} = yield call(getAmountApi, market)
            yield put(getAmountStatus({
                amountMap:
                    {...amountMap, ...newAmountMap},
                __timerMap__:
                    {...__timerMap__, [ market ]: __timer__}
            }));
        } else {
            yield put(getAmountStatus({amountMap, __timerMap__}))
        }

    } catch (err) {
        yield put(getAmountStatus(err));
    }
}

export function* getResetsSaga({payload}: any) {
    try {
        let {__timerMap__} = store.getState().amountMap;
        if (__timerMap__) {
            Reflect.ownKeys(__timerMap__).map((market) => {
                let __timer__ = __timerMap__ && __timerMap__[ market as string ];
                if (__timer__ && __timer__ !== -1) {
                    clearInterval(__timer__);
                }
            })
        }


        yield put(getAmountStatus({amountMap: undefined, __timerMap__: undefined}));
    } catch (err) {
        yield put(getAmountStatus(err));
    }
}

function* amountSaga() {
    yield all([takeLatest(getAmount, getPostsSaga)]);
}

function* restAmountSaga() {
    yield all([takeLatest(resetAmount, getResetsSaga)]);
}

export const amountForks = [
    fork(amountSaga),
    fork(restAmountSaga),
    // fork(amountsSaga),
]
 