import React from 'react';
import cn from 'classnames';

import './index.scss';

export default function ModelAntigen(props: any) {
    const { isWithB1 } = props;

    return <div className={cn('antigen', `${ isWithB1 ? 'with-b1' : 'without-b1' }`)}></div>
}