
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                navigate("/dashboard");

            } else {

                setMessage(data.message);

            }

        } catch (error) {

            setMessage(
                "Unable to connect to the server."
            );

        }
    };

    return (

        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    ✈️ CrewTrip
                </div>

                <h1>
                    Welcome back 👋
                </h1>

                <p>
                    Login to continue planning
                    your next adventure.
                </p>

                <form onSubmit={handleLogin}>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    {message && (
                        <div className="login-message">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-submit"
                    >
                        Login ✈️
                    </button>

                </form>

                <div className="register-section">

                    <p>
                        Don't have an account?
                    </p>

                    <button
                        className="register-button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create Account
                    </button>

                </div>

                <button
                    className="back-home"
                    onClick={() => navigate("/")}
                >
                    ← Back to CrewTrip
                </button>

            </div>

        </div>
    );
}

export default Login;

