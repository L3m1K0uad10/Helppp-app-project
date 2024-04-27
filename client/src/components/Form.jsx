import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/authpages.css";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [signinError, setSigninError] = useState("");
    const navigate = useNavigate();

    const name = method === "login" ? "Sign in" : "Sign up";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (method === "register" && password !== rePassword) {
            setError("Passwords do not match");
            setTimeout(() => {
                setError("");
            }, 5000);
            return;
        }

        setLoading(true);

        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            setSigninError("wrong credentials");
            setTimeout(() => {
                setSigninError("");
            }, 5000);
            //alert(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <form onSubmit = {handleSubmit} className = "auth-container-form">
            <h1 className = "logo-text"><span className = "span-logo-text">Help</span>pp!</h1>
            <h2 className = "auth-label">{name}</h2>
            <p className = "directive">Please enter your credentials.</p>
            <input
                className="input auth-form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                className="input auth-form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            {signinError && <p className="error-message">{signinError}</p>}
            {method === "register" && (
                <>
                    <input
                        className="input auth-form-input"
                        type="password"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                </>
            )}
            <button className="auth-form-button" type="submit">
                {name}
            </button>
            {method === "login" && (
                <p className="auth-status">
                    New to the Platform? <a className="auth-links" href="/register">Create an account.</a>
                </p>
            )}
            {method === "register" && (
                <p className="auth-status">
                    Already have an account? <a className="auth-links" href="/login">Sign in.</a>
                </p>
            )}
        </form>
    );
}

export default Form;


/* import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form

 */