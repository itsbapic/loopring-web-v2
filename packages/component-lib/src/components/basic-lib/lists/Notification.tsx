import { WithTranslation } from 'react-i18next';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { NotificationItem } from './Interface';
import styled from '@emotion/styled';

const ListItemStyled = styled(ListItem)`
  font-size: ${({theme}) => theme.fontDefault.h5};

  width: 100%;
  padding: ${({theme}) => theme.unit}px ${({theme}) => theme.unit * 2}px;
  height: auto;
  min-height: 1.2em;

  &:not(:last-child) {
    :after {
      content: '';
      display: inline-block;
      width: 100%;
      height: 1px;
      background-color: ${({theme}) => theme.colorBase.blur};
      position: absolute;
      bottom: 0;
      left: 0px;
      padding: 0  ${({theme}) => theme.unit / 2}px
    }
  }

  &:hover {
    border-left-color: transparent;

    // h5 {
      //   color: ${({theme}) => theme.colorBase.primaryLight};
    // }

    background: ${({theme}) => theme.colorBase.background().hover};
  }

  .MuiListItemText-root {
    .MuiTypography-root {
      display: -webkit-box;
      display: -moz-box;
      line-height: 1em;
      white-space: normal;
      word-break: break-all;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    margin: 0;
    overflow: hidden;

  }

  .MuiListItemIcon-root {
    min-width: auto;
    margin-top: 0;
    padding-right: ${({theme}) => theme.unit}px;
  }

  &.error {
    .MuiListItemIcon-root {
      color: ${({theme}) => theme.colorBase.error};
    }
  }

  &.pending {
    .MuiListItemIcon-root {
      color: ${({theme}) => theme.colorBase.secondary};
    }
  }

  &.success {
    .MuiListItemIcon-root {
      color: ${({theme}) => theme.colorBase.success};
    }
  }

`
// export const MenuStyled  = styled.div`
//    width: 280px;
//    height: 100px;
//    display: flex;
//    flex-direction: column;
//    overflow-y: scroll;
//    justify-content: space-around;
//    align-items: stretch ;
//    align-content: center;
//   .wallet-alert{
//     height: auto;
//     text-overflow: ellipsis;
//     line-height: 1em;
//     .MuiListItemIcon-root{
//       min-width: auto;
//     }
//     .MuiListItemText{
//       height: 2.4em;
//     }
//
//   }
// `
export const WalletNotificationListItem = ({t, label, startIcon, handleClick}: NotificationItem & WithTranslation) => {
    return <ListItemStyled button alignItems="flex-start" onClick={handleClick ? handleClick : undefined}
                           className={`wallet-alert wallet-${startIcon.className}`}>
        <ListItemIcon>{startIcon.iconItem}</ListItemIcon>
        <ListItemText primary={t(label.i18nKey)}/>
    </ListItemStyled>
}
