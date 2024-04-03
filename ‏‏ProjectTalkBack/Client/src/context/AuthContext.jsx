import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, postRequest } from '../utils/Services';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });

  useEffect(()=> {
    const user = sessionStorage.getItem("User");
    if (user) {
      setUser(JSON.parse(user));
    }
  },[]);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  },[]);

  const updateLoginInfo = useCallback((infoLogin) => {
    setLoginInfo(infoLogin);
  },[]);

  const registerUser = useCallback(async(e)=> {
    e.preventDefault();
    setSuccess(true);
    setError(null);
    const response = await postRequest(`${baseUrl}/register`,JSON.stringify(registerInfo));
    setSuccess(false);
    if(response.error){
      return setError(response);
    }
    sessionStorage.setItem("User",JSON.stringify(response));
    setUser(response);
  },[registerInfo]);

  const login = useCallback(async (e)=> {
    e.preventDefault();
    setLoginSuccess(true);
    setLoginError(null);
    const response = await postRequest(`${baseUrl}/login`,JSON.stringify(loginInfo));
    setLoginSuccess(false);
    if(response.error){
      return setLoginError(response);
    }
    sessionStorage.setItem("User", JSON.stringify(response));
    setUser(response);
  },[loginInfo]);

  const logout = useCallback(()=>{
    sessionStorage.removeItem("User");
    sessionStorage.removeItem("user");
    setUser(null);
  },[])
  return (
    <AuthContext.Provider value={{
     user,
     registerInfo,
     updateRegisterInfo,
     registerUser,
     error,
     success,
     logout,
     login,
     loginError,
     loginSuccess,
     loginInfo,
     updateLoginInfo,
     }}>
      {children}
    </AuthContext.Provider>
  );
}