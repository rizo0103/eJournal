import Login from './Auth/Login';
import Register from './Auth/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './Main/Index';
import TestGroup from './assets/js/TestGroup';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/test' element={<TestGroup />} />
      </Routes>
    </BrowserRouter>  
  )
}

export default App
