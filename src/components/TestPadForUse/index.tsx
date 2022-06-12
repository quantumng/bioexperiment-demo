import { FC, useEffect, useRef, useState } from 'react';
import { Toast } from 'antd-mobile';
import { motion, AnimatePresence, useAnimation, useDragControls, PanInfo } from "framer-motion";
import cn from 'classnames';

import { Step } from '../constant';

import ModelSample from '../ModelSample';
import ModelAntigen from '../ModelAntigen';
import ModelAntibody from '../ModelAntibody';
import ModelPrimaryAntibody from '../ModelPrimaryAntibody';
import ModelSecondaryAntibody from '../ModelSecondaryAntibody';

import './index.scss';

const SampleBottle: FC<any> = (props) => {
    const bottleRef = useRef(null);
    // const dragControls = useDragControls();

    const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, hasB1: boolean) => {
        if (info.point.x > 35 && info.point.x < 65 && info.point.y > 600 && info.point.y < 650) {
            console.log('right place');
            props.onDragEnd(Date.now(), hasB1);
            return;
        }
        Toast.show('滴错位置啦！')
    };

    return <>
        <div className='bottle bottle-1'>
            <motion.div
                drag
                whileDrag={{
                    scale: 1.2
                }}
                dragSnapToOrigin
                onDragEnd={(e, i) => { handleDragEnd(e, i, true) }}
            >
                <div className="bottle-head" ref={bottleRef}>
                    <div className="bottle-take"></div>
                    <div className="bottle-drop"></div>
                </div>
            </motion.div>
            <div className="bottle-body">
                <span className="bottle-gate"></span>
                <span className="bottle-box"></span>
                <span>含黄曲霉毒素B1</span>
            </div>
        </div>
        <div className='bottle bottle-2'>
            <motion.div
                drag
                whileDrag={{
                    scale: 1.2
                }}
                dragSnapToOrigin
                onDragEnd={(e, i) => { handleDragEnd(e, i, false) }}
            >
                <div className="bottle-head" ref={bottleRef}>
                    <div className="bottle-take"></div>
                    <div className="bottle-drop"></div>
                </div>
            </motion.div>
            <div className="bottle-body">
                <span className="bottle-gate"></span>
                <span className="bottle-box"></span>
                <span>不含黄曲霉毒素B1</span>
            </div>
        </div>
    </>
}

const limiteMap = {
    [Step.One]: 80,
    [Step.Two]: 150,
    [Step.Three]: 205,
    [Step.Four]: 160,
    [Step.Five]: 60,
}
const distanceMap = {
    [Step.One]: 0,
    [Step.Two]: 100,
    [Step.Three]: 185,
    [Step.Four]: 260,
    [Step.Five]: 290,
}

const GroupAntibody: FC<any> = (props) => {
    const { step } = props;
    return <>
        {
            step > Step.Two ? null : <div className='antibody-group'>
                <div>
                    <ModelAntibody {...props} />
                    <ModelAntibody {...props} />
                </div>
                <div>
                    <ModelAntibody {...props} />
                    <ModelAntibody {...props} />
                </div>
            </div>
        }
    </>
};

const GroupPrimaryAntibody: FC<any> = (props) => {
    const { step } = props;
    return <>
        {
            step > Step.Three ? null : <div className='primary-antibody-group'>
                <ModelPrimaryAntibody {...props} />
                <ModelPrimaryAntibody {...props} />
                <ModelPrimaryAntibody {...props} />
            </div>
        }
    </>
};

const GroupSecondaryAntibody: FC<any> = (props) => {
    const { step } = props;
    return <>
        {
            step > Step.Four ? null : <div className='secondary-antibody-group'>
                <ModelSecondaryAntibody {...props} />
                <ModelSecondaryAntibody {...props} />
                <ModelSecondaryAntibody {...props} />
            </div>
        }
    </>
};

const TestPad: FC<any> = ({ dropFlag, isWithB1, useStep } ) => {
    const [ step, setStep ] = useStep;
    // @ts-ignore
    const [limite, setLimite] = useState(limiteMap[step]);
    const dripAnimation = useAnimation();
    const sampleAnimation = useAnimation();
    const antibodyAnimation = useAnimation();

    const handleDragEnd = (e, i) => {
        if (step >= Step.Five) {
            antibodyAnimation.start({
                x: 400,
                opacity: 0,
            })
            return;
        };
        console.log('TestPad handleDragEnd', i.point);
        // @ts-ignore
        if (i.point.x > distanceMap[step]) {
            console.log('right place', step);
            // @ts-ignore
            setLimite(limiteMap[step]);
            setStep(step + 1);
        }
    }

    const handleDropStart = async() => {
        await dripAnimation.start({
            y: [50, 80, 100],
            opacity: [0, 1, 0],
        });
        await sampleAnimation.start({
            opacity: [0, 1, 0],
            scale: [0, 1, 1],
        });
        setStep(Step.Two);
    }

    useEffect(() => {
        dropFlag && handleDropStart();
    }, [dropFlag]);

    useEffect(() => {
        // @ts-ignore
        console.log('listen step', step, limite, distanceMap[step]);
    }, [step]);
    
    return <div className="testpad-wrapper">
        <div className="drop-position drop-position-1">
        <motion.div animate={dripAnimation} initial={{opacity: 0}}>
            <div className="drip"></div>
        </motion.div>
        </div>
        <div className="drop-position drop-position-2"></div>
        <div className="drop-land">
            <motion.div animate={sampleAnimation} initial={{opacity: 0, scale: 0}}>
                <ModelSample />
            </motion.div>
        </div>
        <div className="drop-moving-position">
            <AnimatePresence>
                {
                    step > Step.One && <motion.div drag='x' animate={antibodyAnimation} dragConstraints={{ left: 0, right: limite }} onDragEnd={handleDragEnd}>
                        { step === Step.Two ? <ModelAntigen isWithB1={isWithB1} /> : null }
                        { step === Step.Three ? <ModelAntibody isWithB1={isWithB1} /> : null }
                        { step === Step.Four ? <ModelPrimaryAntibody isWithB1={isWithB1} /> : null }
                        { step >= Step.Five ? <ModelSecondaryAntibody isWithB1={isWithB1} /> : null }
                    </motion.div>
                }
            </AnimatePresence>
            
        </div>

        <GroupAntibody step={step} isWithB1={isWithB1} />
        <GroupPrimaryAntibody step={step} isWithB1={isWithB1} />
        <GroupSecondaryAntibody step={step} isWithB1={isWithB1} />

    </div>
}


const TestPadForUse: FC = (props) => {

    const [sampleWithB1, setSampleWithB1] = useState(false);
    const [step, setStep] = useState(Step.One);
    const [dropFlag, refreshDropFlag] = useState(0);

    const handleBottleDrag = (flag: number, withB1: boolean) => {
        setStep(Step.One);
        refreshDropFlag(flag);
        setSampleWithB1(withB1);
    }

    return <div className='testpad-for-use'>
        <SampleBottle onDragEnd={handleBottleDrag}  />
        <TestPad dropFlag={dropFlag} isWithB1={sampleWithB1} useStep={[step, setStep]} />
    </div>
};

export default TestPadForUse;