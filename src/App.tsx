import React, { useState } from 'react';
import { motion } from "framer-motion";

import TestPadForBuild from './components/TestPadForBuild';
import TestPadForUse from './components/TestPadForUse';

import './App.scss';


function App() {
  const [isPadReady, setIsPadReady] = useState(false);

  return (
    <>
      <header className="App-header">Hello, welcome to Bio World!</header>

      { isPadReady ? <TestPadForUse /> : <TestPadForBuild getPadReady={setIsPadReady} /> }
    </>
  )
}

export default App
