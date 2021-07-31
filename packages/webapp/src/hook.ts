import React from 'react';
import { useCustomDCEffect } from 'hooks/common/useCustomDCEffect';
import { useSystem } from './stores/system';
import { ChainId, sleep } from 'loopring-sdk';
import { useAmmMap } from './stores/Amm/AmmMap';
import { STATUS } from './stores/constant';
import { useTokenMap } from './stores/token';
import { useWalletLayer1 } from './stores/walletLayer1';
import { useAccount } from './stores/account/hook';
import { connectProvides, ErrorType, useConnectHook } from '@loopring-web/web3-provider';
import { AccountStatus } from './stores/account';
import { AccountStep, useOpenModals, WalletConnectStep } from '@loopring-web/component-lib';
import { LoopringAPI } from './stores/apis/api';
import { unlockAccount } from './hooks/unlockAccount';


/**
 * @description
 * @step1 subscribe Connect hook
 * @step2 check the session storage ? choose the provider : none provider
 * @step3 decide china Id by step2
 * @step4 prepare the static date (tokenMap, ammMap, faitPrice, gasPrice, forex, Activities ...)
 * @step5 launch the page
 * @todo each step has error show the ErrorPage , next version for service maintain page.
 */

export function useInit() {
    const [state, setState] = React.useState<keyof typeof STATUS>('PENDING')
    // const systemState = useSystem();
    const tokenState = useTokenMap();
    const ammMapState = useAmmMap();
    const {
        updateSystem,
        chainId: _chainId,
        exchangeInfo,
        status: systemStatus,
        statusUnset: systemStatusUnset
    } = useSystem();
    const {account, updateAccount} = useAccount();
    const {setShowConnect, setShowAccount} = useOpenModals();
    const walletLayer1State = useWalletLayer1()
    const handleChainChanged = React.useCallback(async (chainId) => {
        if (chainId !== _chainId) {
            updateSystem({chainId});
            window.location.reload();
        }
    }, [_chainId])
    const handleConnect = React.useCallback(async ({
                                                       accounts,
                                                       chainId,
                                                       provider
                                                   }: { accounts: string, provider: any, chainId: number }) => {
        const accAddress = accounts[ 0 ];
        if (chainId !== _chainId) {
            updateSystem({chainId: chainId as ChainId});
            window.location.reload();
        }
        updateAccount({accAddress, readyState: AccountStatus.CONNECT});
        setShowConnect({isShow: true, step: WalletConnectStep.SuccessConnect});

        //TODO if have account  how unlocl if not show
        if (connectProvides.usedWeb3 && exchangeInfo && LoopringAPI.exchangeAPI && LoopringAPI.userAPI) {
            // try {
            const {accInfo} = (await LoopringAPI.exchangeAPI.getAccount({
                owner: accAddress
            }));

            await sleep(1000)
            let activeDeposit = localStorage.getItem('activeDeposit');
            if (activeDeposit) {
                activeDeposit = JSON.stringify(activeDeposit);
            }

            if (accInfo && accInfo.accountId) {
                await unlockAccount({accInfo})

            } else if (activeDeposit && activeDeposit[ accAddress ]) {
                setShowConnect({isShow: false});
                setShowAccount({isShow: true, step: AccountStep.Depositing});

            } else {
                setShowConnect({isShow: false});
                setShowAccount({isShow: true, step: AccountStep.NoAccount});
            }
        }


    }, [_chainId, account])
    const handleAccountDisconnect = React.useCallback(() => {
        debugger
        console.log('Disconnect')
    }, []);

    const handleError = React.useCallback(({type, errorObj}: { type: keyof typeof ErrorType, errorObj: any }) => {

    }, []);

    useConnectHook({handleAccountDisconnect, handleError, handleConnect, handleChainChanged});
    useCustomDCEffect(async () => {
        // TODO getSessionAccount infor
        if (account && account.connectName && account.accAddress) {
            if (account.accAddress && account.connectName && account.connectName !== 'UnKnow') {
                await connectProvides[ account.connectName ]();
                if (connectProvides.usedProvide) {
                    const chainId = Number(await connectProvides.usedWeb3?.eth.getChainId());
                    updateSystem({chainId: (chainId && chainId === ChainId.GORLI ? chainId as ChainId : ChainId.MAINNET)})
                    return
                }
            }
        }


        //TEST:
        // await connectProvides.MetaMask();
        // if (connectProvides.usedProvide) {
        //     // @ts-ignore
        //     const chainId = Number(await connectProvides.usedProvide.request({method: 'eth_chainId'}))
        //     // // @ts-ignore
        //     //const accounts = await connectProvides.usedProvide.request({ method: 'eth_requestAccounts' })
        //     systemState.updateSystem({chainId: (chainId ? chainId as ChainId : ChainId.MAINNET)})
        //     return
        // }

        updateSystem({chainId: ChainId.MAINNET})


    }, [])
    React.useEffect(() => {
        switch (systemStatus) {
            case "ERROR":
                systemStatusUnset();
                setState('ERROR')
                //TODO show error at button page show error  some retry dispat again
                break;
            case "DONE":
                systemStatusUnset();
                break;
            default:
                break;
        }
    }, [systemStatus, systemStatusUnset]);
    React.useEffect(() => {
        if (ammMapState.status === "ERROR" || tokenState.status === "ERROR") {
            //TODO: solve error
            ammMapState.statusUnset();
            tokenState.statusUnset();
            setState('ERROR');
        } else if (ammMapState.status === "DONE" && tokenState.status === "DONE") {
            ammMapState.statusUnset();
            tokenState.statusUnset();
            setState('DONE');
        }
    }, [ammMapState, tokenState, account.accountId, walletLayer1State])

    return {
        state,
    }

}

