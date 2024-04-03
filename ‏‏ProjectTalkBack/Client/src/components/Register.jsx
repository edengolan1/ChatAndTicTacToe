import { Link } from 'react-router-dom';
import { useContext } from 'react';
import '../styles/Register.css';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const {registerInfo, updateRegisterInfo, registerUser ,error } = useContext(AuthContext);

  return (
    <>
      <div className='register'>
        <div>
        <h1>Register</h1>
        <form onSubmit={registerUser}>
            <div>
               <input type='text' name='username' onChange={(e)=> updateRegisterInfo({...registerInfo,username: e.target.value})} placeholder='please enter username'/>
            </div>
            <div>
              <input type='password' name='password' onChange={(e)=> updateRegisterInfo({...registerInfo,password: e.target.value})} placeholder='please enter password'/>
            </div>
            <div>
              {error?.error && <p>{error?.error}</p>}
            </div>
            <div className='buttonRegister'>
              <input type='submit' value="Register"/>
            </div>
        </form>
        <div className='buttonLogin'>
            <Link to="/login">
                <button>Login</button>
            </Link>
        </div>
        </div>
      </div>
    </>
  )
}

export default Register;