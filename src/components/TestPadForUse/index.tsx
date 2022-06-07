import { FC, useEffect, useRef, useState } from 'react';
import { Toast } from 'antd-mobile';
import { motion, useAnimation, useDragControls, PanInfo } from "framer-motion";
import cn from 'classnames';
import './index.scss';

const SampleBottle: FC<any> = (props) => {
    const bottleRef = useRef(null);
    // const dragControls = useDragControls();

    const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, hasB1: boolean) => {
        if (info.point.x >35 && info.point.x < 65 && info.point.y > 620 && info.point.y < 650) {
            console.log('right place');
            props.onDragEnd(Date.now());
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

const TestPad: FC<any> = ({ dropFlag }) => {
    const [step, setStep] = useState(3);
    const [limite, setLimite] = useState(50);
    const dripAnimation = useAnimation();
    const sampleAnimation = useAnimation();

    const handleDragEnd = (e, i) => {
        console.log('TestPad handleDragEnd', i);
    }
    

    useEffect(() => {
        dropFlag && dripAnimation.start({
            y: [50, 80, 100],
            opacity: [0, 1, 0],
        });
    }, [dropFlag]);
    
    return <div className="testpad-wrapper">
        <div className="drop-position drop-position-1">
        <motion.div animate={dripAnimation} initial={{opacity: 0}}>
            <div className="drip"></div>
        </motion.div>
        </div>
        <div className="drop-position drop-position-2"></div>
        <motion.div drag='x' animate={sampleAnimation} dragConstraints={{ left: 0, right: limite }} onDragEnd={handleDragEnd}>
            { step === 0 ? <div className="sample"></div> : null }
            { step === 1 ? <div className={cn('antigen', {
                'with-b1': true,
                'without-b1': false
            })}></div> : null}
            { step === 2 ? <div className={cn('antibody', {
                'with-b1': true,
                'without-b1': false,
            })}>
                <div className="antibody-head"></div>
                <div className="antibody-body">
                    <span className="antibody-body-part"></span>
                    <span className="antibody-body-part"></span>
                    <span className="antibody-body-part"></span>
                </div>
            </div> : null }
            { step === 3 ? <div className={cn('secantibody', {
                'with-b1': true,
                'without-b1': false,
            })}>
                <div className="antibody-body">
                    <span className="antibody-body-part"></span>
                    <span className="antibody-body-part"></span>
                    <span className="antibody-body-part"></span>
                </div>
            </div> : null }
            
        </motion.div>
        <div className="drop-without-b1"></div>
        <div className="drop-without-b1"></div>
    </div>
}


const TestPadForUse: FC = (props) => {

    const [sampleWithB1, setSampleWithB1] = useState(false);
    const [dropFlag, refreshDropFlag] = useState(null);

    return <div className='testpad-for-use'>
        TestPadForUse
        <SampleBottle onDragEnd={refreshDropFlag} />
        <TestPad dropFlag={dropFlag} />
    </div>
};

export default TestPadForUse;