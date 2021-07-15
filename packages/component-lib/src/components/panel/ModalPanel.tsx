import styled from '@emotion/styled';
import { Box, BoxProps, Modal as MuiModal } from '@material-ui/core';
import {
    AmmPanel,
    AmmProps,
    DepositPanel,
    DepositProps,
    ModalPanelProps,
    ResetPanel,
    ResetProps, SwapPanel, SwapProps,
    TransferPanel,
    TransferProps,
    useOpenModals,
    WithdrawPanel,
    WithdrawProps
} from '../../';
import { IBData } from 'static-resource';


const SwitchPanelStyled = styled(Box)<{ _height?: number|string, _width?: number|string }>`
  & > div {
    background-color: ${({theme}) => theme.colorBase.background().secondary};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ${({_width}) => `
       width: ${_width && Number.isNaN(_width) ? _width + 'px' : _width ? _width : 'var(--transfer-modal-width)'};
    `
}
  }

  & .react-swipeable-view-container {
    ${({_height}) => `
       height: ${_height && Number.isNaN(_height) ? _height + 'px': _height? _height: 'unset'} ;
    `
}

` as React.ElementType<{ _height?: number|string, _width?: number|string  } & BoxProps>
const Modal = ({open, onClose, content, height, width}: ModalPanelProps) => {
    return <MuiModal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <SwitchPanelStyled {...{_height: height, _width: width}} style={{boxShadow: '24'}}>
            {content}
        </SwitchPanelStyled>
    </MuiModal>
}

export const ModalPanel = <T extends IBData<I>, I>({transferProps, withDrawProps, depositProps, resetProps, ammProps, swapProps}: {
    transferProps: TransferProps<T, I>,
    withDrawProps: WithdrawProps<T, I>,
    depositProps: DepositProps<T, I>,
    resetProps: ResetProps<T, I>
    ammProps:  AmmProps<any,T,any>
    swapProps:  SwapProps<T,I, any>
}) => {
    const {
        modals,
        setShowAmm,
        setShowSwap,
        setShowTransfer,
        setShowDeposit,
        setShowWithdraw,
        setShowResetAccount
    } = useOpenModals()
    const {
        isShowTransfer,
        isShowWithdraw,
        isShowDeposit,
        isShowResetAccount,
        isShowAmm,
        isShowSwap
    } = modals;
    return <>
        <Modal open={isShowTransfer.isShow} height={620} onClose={() => setShowTransfer({isShow: false})}
               content={<TransferPanel<any,any> {...{...transferProps,...isShowTransfer.props}}> </TransferPanel>}/>
        <Modal open={isShowWithdraw.isShow} height={620} onClose={() => setShowWithdraw({isShow: false})}
               content={<WithdrawPanel<any,any> {...{...withDrawProps, ...isShowWithdraw.props}}  > </WithdrawPanel>}/>
        <Modal open={isShowDeposit.isShow}
               width={`var(--swap-box-width)`} onClose={() => setShowDeposit({isShow: false})}
               content={<DepositPanel<any,any> {...{...depositProps, ...isShowDeposit.props}} > </DepositPanel>}/>
        <Modal open={isShowResetAccount.isShow}
               width={`var(--swap-box-width)`}
               onClose={() => setShowResetAccount({...isShowResetAccount, isShow: false})}
               content={<ResetPanel<any,any> {...{...resetProps,...isShowResetAccount.props}} > </ResetPanel>}/>
        <Modal open={isShowAmm.isShow}  width={`var(--swap-box-width)`}
               onClose={() => setShowAmm({...isShowAmm, isShow: false} as any)}
               content={<AmmPanel<any,any,any> {...{...ammProps,...isShowAmm.props}} > </AmmPanel>}/>
        <Modal open={isShowSwap.isShow}   width={`var(--swap-box-width)`}
               onClose={() => setShowSwap({...isShowSwap, isShow: false} as any)}
               content={<SwapPanel<any,any,any> {...{...swapProps,...isShowSwap.props}} > </SwapPanel>}/>
    </>

}