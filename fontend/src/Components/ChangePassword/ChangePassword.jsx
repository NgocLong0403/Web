import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../redux/apiRequest';

const ChangePassword = (id) => {

    const [newPassword, setNewPassword] = useState("");
    // const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChangePassowrd = (e) => {
        e.preventDefault();
        changePassword(newPassword, dispatch, navigate, id)
    }
    console.log("id", id);
    return (
        <section className="login-container">
            <div className="login-title"> Log in</div>
            <form onSubmit={handleChangePassowrd}>
                <label>New password</label>
                <input type="password" placeholder="Enter your new password"
                    onChange={(e) => setNewPassword(e.target.value)} />
                <label>Comfirm new password</label>
                <input type="password" placeholder="Enter your confirm new password"
                />

                <button type='submit'>Continue</button>
            </form>

        </section>
    )
}

export default ChangePassword