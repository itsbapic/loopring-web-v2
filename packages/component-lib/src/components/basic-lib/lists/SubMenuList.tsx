import styled from "@emotion/styled";
import { Divider, ListItem, ListItemAvatar, ListItemText, Typography, ListItemProps } from '@material-ui/core';
import { WithTranslation } from 'react-i18next';
import { SubMenuListProps } from './Interface';

import { Link as RouterLink } from 'react-router-dom';

export const SubMenuItem = styled<any>(ListItem)`
  border-left: 0px solid transparent;
  border-right: 1px solid transparent;
  padding: 0 0 0 ${({theme}) => theme.unit / 2 * 5}px;
  width: var(--sub-menuItem-width);
  min-width: var(--sub-menuItem-width);
  height: var(--sub-menuItem-height);

  .MuiTypography-body1 {
    line-height: 1.6em;
    text-transform: capitalize;
  }

  .MuiListItemAvatar-root {

    svg {
      width: var(--header-menu-icon-size);
      height: var(--header-menu-icon-size);
    }

    //:hover {
    //  svg {
    //    color: var(--color-primary); 
    //  }
    //
    //  color: var(--color-primary);
    //}
  }

  &:hover{
    background-color: var(--color-primary);
  }
  &.Mui-selected, &.Mui-selected.Mui-focusVisible {
    background-color: var(--color-primary);
    &:hover{
      background-color: var(--color-primary);
    }
    //border-color:var(--primary);

  }
` as (props:ListItemProps<any>)=>JSX.Element;
export const SubMenuList = <I extends any>({
                                               t,
                                               selected,
                                               subMenu,

                                           }: SubMenuListProps<I> & WithTranslation<'layout'>) => {
    return <>{Object.keys(subMenu).map((list: any, index) => {
        const subList = subMenu[ list ].map((item: any) => {
            return <SubMenuItem button selected={new RegExp(item.label.id, 'ig').test(selected)}
                                alignItems={item.label.description ? 'flex-start' : 'center'}
                                key={item.label.id}
                                {...{
                                    component: RouterLink,
                                    to: item.router ? item.router.path : '',
                                    style: {textDecoration: "none"},
                                    // ...props
                                }}
            >
                <ListItemAvatar>
                    <item.icon></item.icon>
                </ListItemAvatar>
                {item.label.description ? <ListItemText
                    primary={<Typography sx={{display: 'block'}} component="span" variant="body1"
                                         >{t(item.label.i18nKey)}</Typography>}
                    secondary={<Typography sx={{display: 'inline'}} component="span" variant="body2"
                                          >{t(item.label.description)}</Typography>}
                /> : <ListItemText
                    primary={<Typography sx={{display: 'block'}} component="span" variant="body1"
                                        >{t(item.label.i18nKey)}</Typography>}
                />}
            </SubMenuItem>

        });
        return <div key={`group-${list}`}>{subList} {index + 1 !== Object.keys(subMenu).length ?
            <Divider/> : ''}</div>
    })}</>
};

