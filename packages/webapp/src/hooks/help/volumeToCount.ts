import store from '../../stores';
import { toBig } from 'loopring-sdk';
import { BIG10 } from '../../defs/swap_defs';
import BigNumber from 'bignumber.js';

export const volumeToCount = (symbol:string,volumn:string|number|BigNumber,tokenMap= store.getState().tokenMap.tokenMap):number|undefined =>{
   const result =  volumeToCountAsBigNumber(symbol,volumn,tokenMap);
   return result? result.toNumber():undefined;
}
export const volumeToCountAsBigNumber = (symbol:string,volumn:string|number|BigNumber,tokenMap= store.getState().tokenMap.tokenMap):BigNumber|undefined =>{
    if(tokenMap && tokenMap[symbol] && typeof volumn !== 'undefined'){
        try{
            return toBig(volumn).div( BIG10.pow(tokenMap[symbol].decimals))
        }catch (error){
            throw error;
        }
    }else{
        return undefined;
    }
}