import styled from '@emotion/styled';
import { Meta, Story } from '@storybook/react/types-6-0';
import { MemoryRouter } from 'react-router-dom';
import { Box, Container, GlobalStyles, Toolbar, } from '@material-ui/core';

import { css, Theme, useTheme } from '@emotion/react';
import { Header } from '../header/Header';
import { globalCss, headerMenuData, headerToolBarData } from 'static-resource';

import { tradeCalcData } from '../../static';
import { SwapPanel } from '../panel';


const Style = styled.div`
  color: #fff;
`
const TradeWrap = () => {
    let tradeData: any = {sell: {belong: undefined}, buy: {belong: undefined}};
    //TODO: checkRouter
    const WrapSwapPanel = () => {
        let swapProps = {
            swapTradeData:tradeData,
            tradeCalcData,
            onSwapClick: (tradeData:any) => {
                console.log('Swap button click', tradeData);
            },
            handleSwapPanelEvent: async (data: any,switchType:any) => {
                console.log(data,switchType)
            },
        }

        return <SwapPanel<any,any,any> {...swapProps} > </SwapPanel>
    };
    return <>
        <Header headerMenuData={headerMenuData} headerToolBarData={headerToolBarData}
                selected={'markets'}></Header>
        <Toolbar/>
        <Container maxWidth="lg">
            {/*style={{height: '100%' }}*/}
            <Box flex={1} display={'flex'} alignItems={'stretch'} flexDirection="row" marginTop={4}>
                <Box flex={1} marginLeft={4} height={500}>

                </Box>
                <Box display={'flex'}>
                    <WrapSwapPanel/>
                </Box>
            </Box>
        </Container>

        {/*<Footer></Footer>*/}
    </>
}


const Template: Story<any> = () => {
    const theme: Theme = useTheme();
    return <><GlobalStyles styles={css`
      ${globalCss({theme})};
      body:before {
        ${theme.mode === 'dark' ? ` 
                        background: #191C30;
                        background: ${theme.colorBase.background().bg};
                   ` : ''}
      }
    }
    `}></GlobalStyles>
        <Style> <MemoryRouter initialEntries={['/']}>
            <TradeWrap/>
        </MemoryRouter>
        </Style> </>
};

export default {
    title: 'components/Layout/Trade',
    component: TradeWrap,
    argTypes: {},
} as Meta

export const TradeStory = Template.bind({});
// SwitchPanel.args = {}

