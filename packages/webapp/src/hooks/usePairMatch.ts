import { useEffect, useState } from "react"
import { useRouteMatch } from "react-router-dom"
import { useTokenMap } from "stores/token"
import { CoinInfo } from "@loopring-web/common-resources"

export function usePairMatch<C extends { [key: string]: any }>(path: string) {
    const { coinMap } = useTokenMap()
    const match: any = useRouteMatch(`${path}/:market`)

    const [pair, setPair] = useState<{ coinAInfo: CoinInfo<C> | undefined, coinBInfo: CoinInfo<C> | undefined }>({ coinAInfo: undefined, coinBInfo: undefined})
    const [market, setMarket] = useState('')
    
    useEffect(() => {

        if (!coinMap) {
            return
        }

        let market = match?.params?.market ?? 'LRC-ETH'

        const [, coinA, coinB] = market.match(/(\w+)-(\w+)/i)

        const coinAInfo = coinMap[coinA]
        const coinBInfo = coinMap[coinB]

        setPair({ coinAInfo, coinBInfo, })
        setMarket(market)
    }, [])

    return {
        market,
        pair,
        setPair,
    }
}
