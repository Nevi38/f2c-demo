import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { isExistAccount } from '../adapters/account';
import { getUser } from '../adapters/user'

function Login() {
    import ('../styles/login.css')

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        const server =
            process.env.REACT_APP_SEVER_IP + ":" +
            process.env.REACT_APP_SERVER_PORT;
        const backgroundLogin = `url("${server}/theme/1698592361989.JPEG")`
        document.documentElement.style.setProperty('--backgroundLogin', backgroundLogin);
    }, [])

    function handleInputChange(e) {
        const { id, value } = e.target;

        if (id === "username") {
            setUsername(value)
        }
        if (id === "password") {
            setPassword(value);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const account = {
            'username': username,
            'password': password
        }

        const userID = await isExistAccount(account) // return userID if found, otherwise return null

        if (!!userID) {

            const userAuth = {
                'user': await getUser(userID),
                'isAuth': "true"
            }

            sessionStorage.setItem("userAuth", JSON.stringify(userAuth))

            window.location.href = "./"
        }
        else {
            alert("Tài khoản hoặc mật khẩu không đúng, vui lòng kiểm tra lại")
        }
    }

    function redirectRegister() {
        navigate('/register')
    }

    return (
        <div id='wrap-full'>
            <div id="wrapper-login">
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            id='username'
                            name="login-input-user"
                            type="text"
                            placeholder="User name"
                            onChange={(e) => handleInputChange(e)}
                        />
                        <span id="img-user" className="text-white material-symbols-outlined">
                            person
                        </span>
                    </div>
                    <div className="input-box">
                        <input
                            id="password"
                            name="login-input-password"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => handleInputChange(e)}
                        />
                        <span id="img-lock" className="text-white material-symbols-outlined">
                            key
                        </span>
                    </div>
                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="./forgot-pass.html"> Forgot password?</a>
                    </div>
                    <button type="submit" className="btn">
                        Login
                    </button>
                    <div className="register-btn">
                        <p>
                            Don't have an account? <label id="btn-register" onClick={redirectRegister}> Register </label>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;
