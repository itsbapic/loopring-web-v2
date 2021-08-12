import styled from '@emotion/styled'
import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'
import { withTranslation } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { Button, Grid } from '@material-ui/core'
import { ConnectProviders, gatewayList } from '@loopring-web/common-resources'
import {
    ModalWalletConnect,
} from './WalletConnect'

import {
    AccountBaseProps,
    AccountStep,
    ActiveAccountProcess,
    ApproveAccount,
    DepositApproveProcess,
    Depositing,
    FailedDeposit,
    FailedTokenAccess,
    FailedUnlock,
    HadAccount,
    ModalAccount,
    NoAccount,
    ProcessUnlock,
    SuccessUnlock,
    TokenAccessProcess,
} from './AccountInfo';
import { account, coinMap, CoinType, walletMap } from '../../static';
import { DepositProps, SwapTradeData, SwitchData, TradeBtnStatus } from '../index';
import { DepositWrap } from '../panel/components';
import { Box } from '@material-ui/core/';


const Style = styled.div`
  color: #fff;
  flex: 1;
  height: 100%;
`


let tradeData: any = {};
let depositProps: DepositProps<any, any> = {
    isNewAccount: true,
    tradeData,
    coinMap,
    walletMap,
    depositBtnStatus: TradeBtnStatus.AVAILABLE,
    onDepositClick: (tradeData: SwapTradeData<CoinType>) => {
        console.log('Swap button click', tradeData);
    },
    handlePanelEvent: async (props: SwitchData<any>, switchType: 'Tomenu' | 'Tobutton') => {
        return new Promise((res) => {
            setTimeout(() => {
                console.log('wait 100, with props', props, switchType);
                res();
            }, 500)
        })
    }
}

const coinInfo = coinMap[ 'USDC' ]
const Template: Story<any> = withTranslation()(({...rest}: any) => {
    const [openAccount, setOpenAccount] = React.useState(false)

    gatewayList[ 0 ] = {
        ...gatewayList[ 0 ],
        handleSelect: () => console.log('metaMask 11'),
    };

    const mainBtn = React.useMemo(() => {
        return <Button variant={'contained'} fullWidth size={'medium'} onClick={() => {
        }}>{'unlock'} </Button>
    }, []);
    const accountInfoProps: AccountBaseProps = {
        ...account,
        level: 'VIP 1',
        etherscanUrl: 'https://material-ui.com/components/material-icons/'
    }

    const {nameList, accountList} = React.useMemo(() => {
        const accountMap = {
            [ AccountStep.NoAccount ]: <NoAccount {...{
                ...accountInfoProps, goDeposit: () => {
                }
            }}/>,
            [ AccountStep.Deposit ]: <DepositWrap _height={480} _width={400}  {...{...rest, ...depositProps}} />,
            [ AccountStep.Depositing ]: <Depositing {...{
                onClose:()=>undefined,
                providerName: ConnectProviders.MetaMask,
                etherscanLink: accountInfoProps.etherscanUrl, ...rest
            }}/>,
            [ AccountStep.FailedDeposit ]: <FailedDeposit {...rest} label={'depositTitleAndActive'}
                                                          onRetry={() => undefined}
                                                          etherscanLink={accountInfoProps.etherscanUrl}/>,
            [ AccountStep.SignAccount ]: <ApproveAccount  {...{...accountInfoProps, ...rest}}
                                                          goActiveAccount={() => undefined}/>,
            [ AccountStep.ProcessUnlock ]: <ProcessUnlock {...{providerName: ConnectProviders.MetaMask, ...rest}}/>,
            [ AccountStep.SuccessUnlock ]: <SuccessUnlock {...rest}/>,
            [ AccountStep.FailedUnlock ]: <FailedUnlock {...rest} onRetry={() => undefined}/>,
            [ AccountStep.HadAccount ]: <HadAccount mainBtn={mainBtn} {...accountInfoProps}/>,
            [ AccountStep.TokenAccessProcess ]: <TokenAccessProcess {...{
                ...rest,
                coinInfo,
                providerName: ConnectProviders.MetaMask
            }}/>,
            [ AccountStep.DepositApproveProcess ]: <DepositApproveProcess {...{
                ...rest,
                providerName: ConnectProviders.MetaMask
            }}/>,
            [ AccountStep.ActiveAccountProcess ]: <ActiveAccountProcess {...{
                ...rest,
                providerName: ConnectProviders.MetaMask
            }}/>,
            [ AccountStep.FailedTokenAccess ]: <FailedTokenAccess {...{...rest, coinInfo}}/>,
        }

        return { nameList: Object.keys(accountMap), accountList: Object.values(accountMap) }

    }, [])

    return (
        <>
            <Style>
                <MemoryRouter initialEntries={['/']}>
                    <Grid container spacing={2}>

                        {accountList.map((panel, index) => {
                            return <Box key={index} display={'flex'} flexDirection={'column'} width={480} height={400} padding={2}
                                        justifyContent={'center'} alignItems={'stretch'}>
                                {AccountStep[nameList[index]]}
                                {panel}
                            </Box>
                        })}
                    </Grid>
                    <Button variant={'outlined'} size={'small'} color={'primary'} style={{marginRight: 8}}
                            onClick={() => setOpenAccount(true)}>Connect wallet</Button>
                    <ModalAccount open={openAccount} onClose={() => setOpenAccount(false)}
                                  panelList={accountList} step={AccountStep.Deposit}/>
                                  
                </MemoryRouter>
            </Style>
        </>
    )
}) as Story<any>

export const ModalListStory = Template.bind({})

export default {
    title: 'components/account_list',
    component: ModalWalletConnect,
    argTypes: {},
} as Meta
