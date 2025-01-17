import { AmmPoolActivityRule, LoopringMap } from '@loopring-web/loopring-sdk';
import React from 'react';
import { AmmRecordRow, MyPoolRow } from '@loopring-web/component-lib';
import { makeWalletLayer2 } from 'hooks/help/makeWallet';
import {
  getUserAmmTransaction,
  makeMyAmmMarketArray,
  makeMyPoolRowWithPoolState,
  makeSummaryMyAmm,
  SummaryMyAmm,
  useAmmTotalValue,
} from 'hooks/help';
import { useTokenMap } from 'stores/token';
import { useWalletLayer2 } from 'stores/walletLayer2';
import { useUserRewards } from 'stores/userRewards';
import { useAmmMap } from 'stores/Amm/AmmMap';
import { SagaStatus } from '@loopring-web/common-resources';
import { useWalletLayer2Socket } from 'services/socket/';
import { useSystem } from 'stores/system';
import store from 'stores'

export const useOverview = <R extends { [ key: string ]: any }, I extends { [ key: string ]: any }>(
  {
    // ammActivityMap
  }: { ammActivityMap: LoopringMap<LoopringMap<AmmPoolActivityRule[]>> | undefined }
): {
  myAmmMarketArray: AmmRecordRow<R>[],
  summaryReward: SummaryMyAmm | undefined,
  myPoolRow: MyPoolRow<R>[],
  showLoading: boolean,

} => {
  const {status: walletLayer2Status} = useWalletLayer2();
  const {status: userRewardsStatus, userRewardsMap} = useUserRewards();
  const {tokenMap} = useTokenMap();
  const {status: ammMapStatus, ammMap} = useAmmMap();
  const {getAmmLiquidity} = useAmmTotalValue()
  const {forex} = useSystem()
  const {tokenPrices} = store.getState().tokenPrices

  const [summaryReward, setSummaryReward] = React.useState<SummaryMyAmm | undefined>(undefined);
  const [myPoolRow, setMyPoolRow] = React.useState<MyPoolRow<R>[]>([])
  const [myAmmMarketArray, setMyAmmMarketArray] = React.useState<AmmRecordRow<R>[]>([])
  const [showLoading, setShowLoading] = React.useState(false)

  const walletLayer2DoIt = React.useCallback(async () => {
    const {walletMap: _walletMap} = makeWalletLayer2(false);
    if (_walletMap) {
      const res = await getUserAmmTransaction({})
      let _myTradeArray = makeMyAmmMarketArray(undefined, res ? res.userAmmPoolTxs : [])
      setMyAmmMarketArray(_myTradeArray ? _myTradeArray : [])

    }
    return _walletMap
  }, [])

  const makeMyPoolRow = React.useCallback(async (_walletMap): Promise<MyPoolRow<R>[]> => {
    if (_walletMap && ammMap && userRewardsMap && tokenPrices && forex) {
      // @ts-ignore
      const _myPoolRow: MyPoolRow<R>[] = Reflect.ownKeys(_walletMap).reduce((prev: MyPoolRow<R>[], walletKey: string) => {
        if (/LP-/i.test(walletKey)) {
          const ammKey = walletKey.replace('LP-', 'AMM-');
          const marketKey = walletKey.replace('LP-', '');
          let rowData: MyPoolRow<R> | undefined;
          //TODO：websocket open
          //  if(ammPoolSnapShots)
          // makeData by snapshot else
          // else
          rowData = makeMyPoolRowWithPoolState(
            {
              ammDetail: ammMap[ ammKey ],
              walletMap: _walletMap,
              market: marketKey,
              ammUserRewardMap: userRewardsMap
            }
          ) as any
          if (rowData !== undefined) {
            prev.push(rowData);
          }
        }

        return prev
      }, [] as MyPoolRow<R>[])

      const formattedPoolRow = _myPoolRow.map((o: any) => {
        const market = `LP-${o.ammDetail?.coinAInfo.simpleName}-${o.ammDetail?.coinBInfo.simpleName}`
        const totalAmount = o.totalLpAmount
        const totalAmmValueDollar = (tokenPrices[ market ] || 0) * totalAmount
        const totalAmmValueYuan = (totalAmmValueDollar || 0) * forex
        const coinA = o.ammDetail?.coinAInfo?.simpleName
        const coinB = o.ammDetail?.coinBInfo?.simpleName
        const precisionA = tokenMap ? tokenMap[ coinA ]?.precision : undefined
        const precisionB = tokenMap ? tokenMap[ coinB ]?.precision : undefined

        return ({
          ...o,
          totalAmmValueDollar,
          totalAmmValueYuan,
          precisionA,
          precisionB
        })
      })
      return formattedPoolRow as any;
    }
    return [];
  }, [ammMap, userRewardsMap, getAmmLiquidity, tokenPrices, forex])

  const walletLayer2Callback = React.useCallback(async () => {
    if (ammMap && tokenPrices && userRewardsMap && forex) {
      setShowLoading(true)
      const _walletMap = await walletLayer2DoIt();
      const _myPoolRow = await makeMyPoolRow(_walletMap);
      setMyPoolRow(_myPoolRow)
      setShowLoading(false)
    }
  }, [ammMap, makeMyPoolRow, walletLayer2DoIt, tokenPrices])

  useWalletLayer2Socket({walletLayer2Callback})
  React.useEffect(() => {

    if (ammMapStatus === SagaStatus.UNSET && userRewardsStatus === SagaStatus.UNSET && walletLayer2Status === SagaStatus.UNSET) {
      walletLayer2Callback()
    }
  }, [ammMapStatus, userRewardsStatus, walletLayer2Status])

  React.useEffect(() => {
    setShowLoading(true)
  }, [])

  React.useEffect(() => {
    if (userRewardsStatus === SagaStatus.UNSET) {
      const summaryReward = makeSummaryMyAmm({userRewardsMap});
      setSummaryReward(summaryReward);
      walletLayer2Callback()
    }
  }, [userRewardsStatus])
  return {
    myAmmMarketArray,
    summaryReward,
    myPoolRow,
    showLoading
  }

}
