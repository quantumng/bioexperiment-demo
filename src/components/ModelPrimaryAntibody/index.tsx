import React from 'react';
import cn from 'classnames';

import './index.scss'

export default function ModelPrimaryAntibody(props: any) {
    const { isWithB1 } = props;

    return <div className={cn('primary-antibody', `${ isWithB1 ? 'with-b1' : 'without-b1' }`)}>
        <div className="primary-antibody-head"></div>
        <div className="primary-antibody-body"></div>
    </div>
}