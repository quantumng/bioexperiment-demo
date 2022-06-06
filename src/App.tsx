import React, { useState } from 'react';
import { motion } from "framer-motion";

import TestPadForBuild from './components/TestPadForBuild';
import TestPadForUse from './components/TestPadForUse';

import './App.scss';


function App() {
  const [isPadReady, setIsPadReady] = useState(true);

  return (
    <>
      <header className="App-header">Hello, welcome to the Bio World!</header>

      { isPadReady ? <TestPadForUse /> : <TestPadForBuild getPadReady={setIsPadReady} /> }
    </>
  )
}

export default App
