import Form from "../components/Form"
import illustration from "../assets/illustration1.jpeg";

function Login() {
    return (
        <div className = "auth-container">
            <Form route = "/api/token/" method = "login" />
            <div className = "auth-illustration">
                <img src = {illustration} alt = "illustration" width = "100%"/>
                <h2 className = "illustration-label">There is nothing better than<br/> helping each other</h2>
            </div>
        </div>
    )
}

export default Login