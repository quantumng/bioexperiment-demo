import { useState } from "react";
import cn from "classnames";

import './index.scss';

export default function ModelAntibody(props: any) {
    const { isWithB1 } = props;

    return <div className={cn('antibody', `${ isWithB1 ? 'with-b1' : 'without-b1' }`)}>
        <div className="antibody-head"></div>
        <div className="antibody-body">
            <span className="antibody-body-part"></span>
            <span className="antibody-body-part"></span>
            <span className="antibody-body-part"></span>
        </div>
    </div>
}