import {
    FC,
    Dispatch,
    SetStateAction,
    useState,
    useRef,
    useCallback,
} from 'react';

import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { usePreview } from 'react-dnd-preview';


import pvcBackgroundUrl from '../../assets/covid_19_test_pvc_background.png';
import hno3PadUrl from '../../assets/covid_19_test_hno3_pad.png';
import samplePadUrl from '../../assets/covid_19_test_sample_pad.png';
import unionPadUrl from '../../assets/covid_19_test_union_pad.png';
import waterAbsorberUrl from '../../assets/covid_19_test_water_absorber.png';
import testPadUrl from '../../assets/covid-19-test.png';

import './index.scss';
import { Item } from 'framer-motion/types/components/Reorder/Item';

{/* <img src={waterAbsorberUrl} alt="吸水滤纸" width={'100%'} />
<img src={hno3PadUrl} alt="NC膜" width={'100%'} />
<img src={pvcBackgroundUrl} alt="PVC背板" width={'100%'} />
<img src={unionPadUrl} alt="结合垫" width={'100%'} />
<img src={samplePadUrl} alt="样品垫" width={'100%'} /> */}

interface Props {
    getPadReady: Dispatch<SetStateAction<boolean>>;
}

const ITEM_TYPES = {
  NC_PAD: 'nc_pad',
  SAMPLE_PAD: 'sample_pad',
  UNION_PAD: 'union_pad',
  WATER_ABSORBER: 'water_absorber',
}

const padItemMap = {
  [ITEM_TYPES.SAMPLE_PAD]: {
    type: ITEM_TYPES.SAMPLE_PAD,
    url: samplePadUrl,
    order: 2,
    className: 'test-pad sample-pad',
    name: '样品垫',
  },
  [ITEM_TYPES.UNION_PAD]: {
    type: ITEM_TYPES.UNION_PAD,
    url: unionPadUrl,
    order: 1,
    className: 'test-pad union-pad',
    name: '结合垫',
  },
  [ITEM_TYPES.NC_PAD]: {
    type: ITEM_TYPES.NC_PAD,
    url: hno3PadUrl,
    order: 0,
    className: 'test-pad nc-pad',
    name: 'NC膜',
  },
  [ITEM_TYPES.WATER_ABSORBER]: {
    type: ITEM_TYPES.WATER_ABSORBER,
    url: waterAbsorberUrl,
    order: 3,
    className: 'test-pad absorber-pad',
    name: '吸水垫',
  }
}

const containers = [ITEM_TYPES.SAMPLE_PAD, ITEM_TYPES.UNION_PAD, ITEM_TYPES.NC_PAD, ITEM_TYPES.WATER_ABSORBER];

const MyPreview = () => {
  const {display, itemType, item, style} = usePreview()
  if (!display) {
    return null
  }
  return <div className="preview-item" style={style}>
      <img src={item.url} alt="" />
  </div>
}

const PadItem: FC<any> = ({ children, padItem, pieces }) => {
  const [ {isDragging}, drag ] = useDrag(() => ({
    type: padItem.type,
    item: padItem,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
        ref={drag}
        data-name={padItem.name}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
        }}
      >
        <img className={padItem.className} src={padItem.url} alt={padItem.name} />
      </div>
  )
}

const Overlay: FC<any> = ({ color }) => {
  return (
    <div
      className="overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: color,
      }}
    />
  )
}

const BoxItem: FC<any> = ({ boxItem, children, onDrop, pieces }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: boxItem.type,
    drop: onDrop,
    canDrop: () => {
      console.log('BoxItem candrop', pieces.current, boxItem.order);
      return pieces.current.length === boxItem.order
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
}))

  return (
    <div
      ref={drop}
    >
      { pieces.current.includes(boxItem.type) ? <img src={boxItem.url} alt="" /> : null }
      {isOver && !canDrop && <Overlay color="red" />}
      {!isOver && canDrop && <Overlay color="yellow" />}
      {isOver && canDrop && <Overlay color="green" />}
    </div>
  )
}

const TestPadForBuild: FC<Props> = ({ getPadReady }) => {
    const pieces = useRef<string[]>([]);
    const [ padList, setPadList ] = useState(containers);

    const handleDropItem = useCallback((item: any) => {
      if (item.order === pieces.current.length) {
        pieces.current.push(item.type);
        const list = padList.filter(v => {
          return v !== item.type;
        });
        setPadList(list);
      }

      if (pieces.current.length >= 4) {
        getPadReady(true);
      }
    }, [padList]);

    return (
      <div className="build-wrapper">
        <p style={{textAlign: 'center'}}>请先完成检测卡的组装,注意依次摆放！</p>
        <DndProvider backend={TouchBackend}>
  
          <div className="selector-zone">
          
            {
              pieces.current.includes(ITEM_TYPES.WATER_ABSORBER) ? null : <PadItem padItem={padItemMap[ITEM_TYPES.WATER_ABSORBER]} pieces={pieces}></PadItem>
            }
            {
              pieces.current.includes(ITEM_TYPES.UNION_PAD) ? null : <PadItem padItem={padItemMap[ITEM_TYPES.UNION_PAD]} pieces={pieces}></PadItem>
            }
            {
              pieces.current.includes(ITEM_TYPES.SAMPLE_PAD) ? null : <PadItem padItem={padItemMap[ITEM_TYPES.SAMPLE_PAD]} pieces={pieces}></PadItem>
            }
            {
              pieces.current.includes(ITEM_TYPES.NC_PAD) ? null : <PadItem padItem={padItemMap[ITEM_TYPES.NC_PAD]} pieces={pieces}></PadItem>
            }

          </div>
          <div className="drop-zone">
            {
              containers.map((item) => {
                return <BoxItem boxItem={padItemMap[item]} onDrop={handleDropItem} key={item} pieces={pieces}></BoxItem>
              })
            }
          </div>
          <MyPreview />
        </DndProvider>
      </div>
    );
};

export default TestPadForBuild;