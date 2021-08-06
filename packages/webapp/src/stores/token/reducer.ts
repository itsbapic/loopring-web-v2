import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'
import { GetTokenMapParams, TokenMapStates } from './interface';
import { SagaStatus } from '@loopring-web/common-resources';

const initialState: TokenMapStates<object> = {
    coinMap: {},
    totalCoinMap: {},
    addressIndex: undefined,
    tokenMap: undefined,
    marketMap: undefined,
    idIndex: undefined,
    status: 'DONE',
    errorMessage: null,
}
const tokenMapSlice: Slice<TokenMapStates<object>> = createSlice({
    name: 'tokenMap',
    initialState,
    reducers: {
        getTokenMap(state, action: PayloadAction<GetTokenMapParams<any>>) {
            state.status = SagaStatus.PENDING
        },
        getTokenMapStatus(state, action: PayloadAction<TokenMapStates<object>>) {
            // @ts-ignore      console.log(action.type)
            if (action.error) {
                state.status = SagaStatus.ERROR
                // @ts-ignore
                state.errorMessage = action.error
            }

            const {
                tokenMap,
                totalCoinMap,
                marketMap,
                addressIndex,
                idIndex,
                coinMap,
                marketArray,
                marketCoins
            } = action.payload;
            if (tokenMap) {
                state.tokenMap = tokenMap
            }
            if (marketMap) {
                state.marketMap = marketMap
            }
            if (addressIndex) {
                state.addressIndex = addressIndex
            }
            if (idIndex) {
                state.idIndex = idIndex
            }
            if (coinMap) {
                state.coinMap = coinMap
            }
            if (totalCoinMap) {
                state.totalCoinMap = totalCoinMap
            }
            if (marketArray) {
                state.marketArray = marketArray
            }
            if (marketCoins) {
                state.marketCoins = marketCoins
            }
            // if (tokenPairsMap) {state.tokenPairsMap = tokenPairsMap }
            state.status = SagaStatus.DONE;
        },

        // getTokenPairMap(state, action: PayloadAction<{tokenPairs: TokenPairs }>) {
        //     const {tokenPairs} = action.payload;
        //     const tokenPairsMap =  Reflect.ownKeys(tokenPairs).reduce((prev,key)=>{
        //         // @ts-ignore
        //         return prev[key as string] =  tokenPairs[key as string].tokenList
        //     }, {} )
        //     if (tokenPairsMap) {state.tokenPairsMap = tokenPairsMap }
        //     // state.status = SagaStatus.PENDING
        // },
        statusUnset: state => {
            state.status = SagaStatus.UNSET
        }

    },
});
export { tokenMapSlice };
export const {getTokenMap, getTokenMapStatus, statusUnset} = tokenMapSlice.actions;