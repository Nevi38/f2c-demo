import React, { useEffect, useState } from 'react';
import { sendAccount } from '../adapters/account';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        import('../styles/login.css')
    }, [])

    function handleInputChange(e) {
        const { id, value } = e.target;

        if (id === "firstName") {
            setFirstName(value);
        }
        if (id === "lastName") {
            setLastName(value);
        }
        if (id === "username") {
            setUsername(value)
        }
        if (id === "password") {
            setPassword(value);
        }
        if (id === "confirmPassword") {
            setConfirmPassword(value)
        }
    }

    function accountIsValid(account) {
        return (
            account.firstName.length >= 2 &&
            account.firstName.length <= 20 &&
            /^[\p{L}\s]+$/u.test(account.firstName) &&

            account.lastName.length >= 2 &&
            account.lastName.length <= 20 &&
            /^[\p{L}\s]+$/u.test(account.lastName) &&

            account.username.length >= 6 &&
            account.username.length <= 20 &&
            /^[A-Za-z0-9]+$/.test(account.username) &&

            account.password.length >= 8 &&
            account.password.length <= 20 &&
            /[!@#$%^&*()_+[\]{};:'"\\|,.<>?]/.test(account.password) &&
            /[0-9]/.test(account.password) &&
            /[A-Z]/.test(account.password) &&
            /[a-z]/.test(account.password) &&

            account.password === account.confirmPassword
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const account = {
            'username': username,
            'password': password,
            'confirmPassword': confirmPassword,
            'firstName': firstName,
            'lastName': lastName,
            'avatar': 'anonymous.png'
        }

        if (accountIsValid(account)) {
            delete account.confirmPassword

            const response = await sendAccount(account)

            if (response == false)
                alert("Vui lòng chọn username khác")
            else
                navigate('/');
        }
        else {
            alert("Không hợp lệ")
        }
    }

    return (
        <div id='wrap-full'>
            <div id="wrapper-login">
                <form onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <div className="input-box row">
                        <input id='firstName'
                            className='mr-15'
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <input id='lastName'
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => handleInputChange(e)}
                        />
                    </div>
                    <div className="input-box">
                        <input id='username'
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <span id="img-user" className="text-white material-symbols-outlined">
                            person
                        </span>
                    </div>
                    <div className="input-box">
                        <input id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <span id="img-lock" className="text-white material-symbols-outlined">
                            key
                        </span>
                    </div>
                    <div className="input-box">
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <span id="img-lock" className="text-white material-symbols-outlined">
                            key
                        </span>
                    </div>
                    <button type="submit" className={
                        (isValid) ? 'btn' : 'btn btn-disable'
                    }>
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register;
