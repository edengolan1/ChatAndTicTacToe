import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import Game from './components/games/Game';
import NavBar from './components/NavBar';

function App() {
  const {user} = useContext(AuthContext);
  return (
    <ChatContextProvider user={user}>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={user? <Chat /> : <Navigate to="/login"/>} />
          <Route path='/login' element={user? <Chat /> : <Login />} />
          <Route path='/register' element={user? <Chat /> : <Register />} />
          <Route path='/game' element={<Game/>} />
          <Route path='*' element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ChatContextProvider>
  );
}

export default App;
