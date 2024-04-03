import { useContext } from 'react'
import { Link } from 'react-router-dom';
import '../styles/Register.css';
import '../styles/Login.css';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const {login,loginError,loginInfo,updateLoginInfo} = useContext(AuthContext);

  return (
    <>
    <div className='login'>
    <h2>Welcome to Sela TalkBack messenger</h2>
      <div>
        <h1>Login</h1>
        <form onSubmit={login}>
            <div>
               <input type='text' name='username' onChange={(e)=> updateLoginInfo({...loginInfo,username: e.target.value})} placeholder='please enter username'/>
            </div>
            <div>
              <input type='password' name='password' onChange={(e)=> updateLoginInfo({...loginInfo,password: e.target.value})} placeholder='please enter password'/>
            </div>
            {loginError && <p>{loginError?.message}</p>}
            <div className='divButtonLogin'>
              <input type='submit' value="Login"/>
            </div>
        </form>
        <div className='divButtonRegister'>
            <Link to="/register">
                <button>Register</button>
            </Link>
        </div>
      </div>       
    </div>
    </>
  )
}

export default Login;