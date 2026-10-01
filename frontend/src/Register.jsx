
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();

        setMessage("");

        if (!name || !email || !password) {
            setMessage("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Registration failed."
                );
                return;
            }

            setMessage(
                "Account created successfully!"
            );

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            console.log("Registration error:", error);

            setMessage(
                "Unable to connect to the server."
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    ✈️
                </div>

                <h1>
                    Create Account
                </h1>

                <p>
                    Join CrewTrip and start planning trips together.
                </p>

                <form onSubmit={handleRegister}>

                    <label>
                        Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                    />

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                    />

                    <button
                        type="submit"
                    >
                        Create Account
                    </button>

                </form>

                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}

                <p className="auth-switch">
                    Already have an account?
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Register;

