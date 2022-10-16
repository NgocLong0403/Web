import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../redux/apiRequest";

const ForgotPassword = () => {
    const [checkEmail, setCheckEmail] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFindEmail = (e) => {
        e.preventDefault();
        forgotPassword(dispatch, navigate)

    };
    return (
        <form onSubmit={handleFindEmail}>
            <label>Email address</label>
            <input type="text" placeholder="Enter your email"
                onChange={(e) => setCheckEmail(e.target.value)} />
            <button type="submit"> Submit </button>
        </form>
    );
}

export default ForgotPassword;