import '../styles/NavBar.css';
import Notifications from './chats/Notifications';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    const {user,logout} = useContext(AuthContext);
    return (
        <div className='navbar'>
            <div className='title-navbar'>
                {user ? <h2>Hello {user?.username}</h2> : <h2>Chat</h2>}
            </div>
            <div>
                <h3>Sela TalkBack</h3>
            </div>
            <div className='buttons-navbar'>
                <div className='button-login-navbar'>{!user && (
                    <>
                     <Link to="/login" className='link'>
                        Login
                    </Link>
                    </>
                )}</div>
                <div className='button-register-navbar'>{!user && (
                    <>
                     <Link to="/register" className='link'>
                        Register
                    </Link>
                    </>
                )}
                </div>
                <div className='button-logout-navbar'>
                    {user && (
                    <>
                      <Link onClick={()=> logout()} to="/login" className='link'>Logout</Link>
                    </>)}
                </div>
                <div className='button-chat-navbar'>
                    <div>
                        {user && (
                        <>
                            <Notifications/>
                        </>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;