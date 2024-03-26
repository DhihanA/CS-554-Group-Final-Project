import {useState} from 'react'
import {Route, Routes, BrowserRouter, useNavigate} from 'react-router-dom';
import {NextUIProvider} from '@nextui-org/react';
import './App.css'
import Home from './components/Home';

function App() {
  const navigate = useNavigate();
  // const [count, setCount] = useState(0)

  return (
    <NextUIProvider navigate={navigate}>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* More Routes below */}
    </Routes>
    </NextUIProvider>
  )
}

export default App
