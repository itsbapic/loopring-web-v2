import { animated, to, useSpring } from 'react-spring';
import { Typography } from '@material-ui/core';
import React from 'react';
import Lottie from "lottie-react";
import { WithTranslation, withTranslation } from 'react-i18next';

export type CardProps = {
    title: string,
    icon: string,
    animationJSON: string,
    describe: string,

}
export const Card = withTranslation(['landPage', 'common'], {withRef: true})((
    {
        t,
        // title,
        // icon,
        // animationJSON,
        // describe,
    }: WithTranslation) => {
    const [{
        // x, y,
        // rotateX, rotateY, rotateZ,
        zoom,
        scale,
        // height,width,
        background, border
    }, api] = useSpring(
        () => ({
            // rotateX: 0,
            // rotateY: 0,
            // rotateZ: 0,
            // x: 0,
            // y: 0,
            scale: 1,
            zoom: 1,
            border: 'var(--border-card)',

            background: 'var(--box-card-background)',

            config: {mass: 5, tension: 350, friction: 40},
        })
    )
    return <animated.div
        onMouseEnter={() => api({
            scale: 1.1,
            zoom: 1.1,
            border: 'var(--border-card)',
            background: 'var(--box-card-background)'
        })}
        className={'card'}
        onMouseLeave={() => api({
            scale: 1,
            zoom: 1,
            border: 'var(--border-card)',
            background: 'var(--box-card-background)',
        })}
        style={{
            transform: 'perspective(600px)',
            height: 640,
            width: 400,
            // x,
            // y,
            background,
            scale: to([scale, zoom], (s, z) => s + z),
            // rotateX,
            // rotateY,
            // rotateZ,
        }}>
        {/* <Lottie  animationData={}/> */}
        <animated.p style={{}}>
            <Typography whiteSpace={'pre-line'} fontWeight={500} component={'h5'}
            >{t('labelSafety')}</Typography>
        </animated.p>
        <animated.span style={{}}>
            <Typography whiteSpace={'pre-line'} color={'var(--text-secondar)'} fontWeight={500} component={'span'}
                        width={306}>{t('Roadprint ensures that user \n assets are as secure a\ns ethereum\'s main network')}</Typography>
        </animated.span>
        {/*<animated.div*/}
        {/*    style={{ transform: y.interpolate(v => `translateY(${v}%`) }}*/}
        {/*    className="glance"*/}
        {/*/>*/}
    </animated.div>


})