
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {

    const navigate = useNavigate();

    const savedUser = JSON.parse(
        localStorage.getItem("user")
    );

    const [name, setName] = useState(
        savedUser?.name || ""
    );

    const [email] = useState(
        savedUser?.email || ""
    );

    const [message, setMessage] = useState("");

    const handleSave = () => {

        if (!name.trim()) {

            setMessage("Please enter your name.");

            return;
        }

        const updatedUser = {
            ...savedUser,
            name: name.trim()
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setMessage(
            "Profile updated successfully!"
        );
    };

    return (

        <div className="profile-page">

            <div className="profile-container">

                <button
                    className="profile-back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>


                <div className="profile-header">

                    <div className="profile-avatar">
                        {name
                            ? name.charAt(0).toUpperCase()
                            : "U"
                        }
                    </div>

                    <div>
                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your CrewTrip account details.
                        </p>
                    </div>

                </div>


                <div className="profile-card">

                    <h2>
                        Personal Information
                    </h2>


                    <div className="profile-field">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your name"
                        />

                    </div>


                    <div className="profile-field">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            disabled
                        />

                    </div>


                    <button
                        className="profile-save-btn"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>


                    {message && (

                        <p className="profile-message">
                            {message}
                        </p>

                    )}

                </div>

            </div>

        </div>

    );
}

export default Profile;

