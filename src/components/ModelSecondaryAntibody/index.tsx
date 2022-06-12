import React from 'react';
import cn from 'classnames';

import './index.scss';

export default function ModelSecondaryAntibody(props: any) {
    const { isWithB1, step } = props;

    return <div className={cn('secondary-antibody', `${ isWithB1 ? 'with-b1' : 'without-b1' }`)}>
        <div className="secondary-antibody-body">
            <span className="secondary-antibody-body-part"></span>
            <span className="secondary-antibody-body-part"></span>
            <span className="secondary-antibody-body-part"></span>
        </div>
    </div>
}