import { FC, useEffect, useRef, useState } from 'react';
import { Toast, Dialog } from 'antd-mobile';
import { motion, AnimatePresence, useAnimation, useDragControls, PanInfo, isDragActive } from "framer-motion";
import cn from 'classnames';

import { Step, getQuestion } from '../constant';

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
        const { x, y, width, height } = props.dropPosition;
        if (info.point.x > x && info.point.x < x + width && info.point.y > y && info.point.y < y + height) {
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

const GroupAntigenWithAntibody: FC<any> = (props) => {
    return <>
        {
            props.isWithB1 ? <div className="antigen-antibody-group with-b1">
                <div>
                    <ModelAntibody {...props} />
                    <ModelAntigen {...props} />
                </div>
            </div> : <div className="antigen-antibody-group without-b1">
                <ModelAntibody {...props} />
                <ModelAntigen {...props} />
                <ModelAntibody {...props} />
            </div>
        }
    </>
}

const GroupAntigenWithPrimaryAntibody: FC<any> = (props) => {

    useEffect(() => {
        console.log('GroupAntigenWithPrimaryAntibody', props.isDragging);
    }, [props.isDragging]);

    return <>
        {
            props.isWithB1 ? <div className="antigen-primary-antibody-group with-b1">
                <GroupAntigenWithAntibody {...props} />
            </div> : <div className="antigen-primary-antibody-group without-b1">
                <ModelPrimaryAntibody {...props} />
                <ModelAntigen {...props} />
                <ModelPrimaryAntibody {...props} />
            </div>
        }
    </>
}



const TestPad: FC<any> = ({ dropFlag, isWithB1, useStep, setPosion } ) => {
    const [ step, setStep ] = useStep;
    const positionRef = useRef(null);
    // @ts-ignore
    const [limite, setLimite] = useState(limiteMap[step]);
    const [rightCount, setRightCount] = useState(0);
    const [ isTLineActive, setTLineActive ] = useState(false);
    const [ isCLineActive, setCLineActive ] = useState(false);
    const dripAnimation = useAnimation();
    const sampleAnimation = useAnimation();
    const antibodyAnimation = useAnimation();

    // @ts-ignore
    const handleDragEnd = async(e, i) => {

        console.log('handleDragEnd', step);
        if (step >= Step.Five) {
            await antibodyAnimation.start({
                x: 400,
                opacity: 0,
            });
            return;
        };
        // @ts-ignore
        if (i.point.x > distanceMap[step]) {
            if (step === Step.Four || step === Step.Three) {
                const { question, options, answer } = getQuestion(step, isWithB1);
                const [ confirmText, cancelText ] = options;
                const res = await Dialog.confirm({ title: '请回答', content: question, cancelText, confirmText });
                if (res === answer) {
                    setRightCount(rightCount + 1);
                };
                if (step === Step.Four) {
                    setCLineActive(true);
                }
                if (step === Step.Three && !isWithB1) {
                    setTLineActive(true);
                }
            }
            console.log('right place', step);
            // @ts-ignore
            setLimite(limiteMap[step]);
            setStep(step + 1);
        }

    }

    const handleDropStart = async() => {
        setCLineActive(false);
        setTLineActive(false);
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

    useEffect(() => {
        // @ts-ignore
        positionRef.current && setPosion(positionRef.current.getBoundingClientRect());
    }, [positionRef]);
    
    return <div className={cn("testpad-wrapper", {
        'tline-active': isTLineActive,
        'cline-active': isCLineActive,
    })}>
        <div className="answer-zone">答对{rightCount}题/总数4题</div>
        <div className="drop-position drop-position-1" ref={positionRef}>
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
                        { step === Step.Three ? <GroupAntigenWithAntibody isWithB1={isWithB1} /> : null }
                        { step === Step.Four ? <GroupAntigenWithPrimaryAntibody isWithB1={isWithB1} isDragging={isDragActive()} /> : null }
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
    const [position, setPosion] = useState(null);

    const handleBottleDrag = (flag: number, withB1: boolean) => {
        setStep(Step.One);
        refreshDropFlag(flag);
        setSampleWithB1(withB1);
    }

    return <div className='testpad-for-use'>
        <SampleBottle onDragEnd={handleBottleDrag} dropPosition={position} />
        <TestPad dropFlag={dropFlag} isWithB1={sampleWithB1} useStep={[step, setStep]} setPosion={setPosion} />
    </div>
};

export default TestPadForUse;