import { utils } from 'ethers'

import { TokenInfo, } from 'loopring-sdk'

import { CoinInfo, } from '@loopring-web/common-resources'

export function getIcon(symbol: string, tokens: any) {
    const token: any = tokens[symbol]
    return getIconByTokenInfo(token)
}

export function getIconByTokenInfo(token: TokenInfo) {
    if (token) {
        const addr = utils.getAddress(token.address)
        const path = `https://exchange.loopring.io/assets/images/ethereum/assets/${addr}/logo.png`
        return path
    }
    return ''
}

export function makeCoinInfo(token: TokenInfo) {
    if (token) {
        const info: CoinInfo<any> = {
            icon: getIconByTokenInfo(token),
            name: token.symbol,
            simpleName: token.symbol,
            description: token.name,
            company: token.name,
        }
        return info
    }
    return undefined
}