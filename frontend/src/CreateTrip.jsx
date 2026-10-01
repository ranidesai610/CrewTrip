import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTrip() {

    const navigate = useNavigate();

    const [tripName, setTripName] = useState("");
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleCreateTrip = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user) {
            navigate("/login");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/trips/create",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        tripName: tripName,
                        destination: destination,
                        startDate: startDate,
                        endDate: endDate,
                        totalBudget: Number(budget),
                        createdBy: user._id
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                setMessage(
                    "Trip created successfully! 🎉"
                );

                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);

            } else {

                setError(
                    data.message ||
                    "Failed to create trip."
                );

            }

        } catch (error) {

            console.log(error);

            setError(
                "Unable to connect to the server."
            );

        }
    };


    return (

        <div className="create-trip-page">

            <div className="create-trip-card">

                <div className="create-trip-logo">
                    ✈️ CrewTrip
                </div>


                <h1>
                    Create a Trip
                </h1>

                <p>
                    Start planning your next adventure
                    with your crew.
                </p>


                <form onSubmit={handleCreateTrip}>

                    <label>
                        Trip Name
                    </label>

                    <input
                        type="text"
                        placeholder="Example: Goa Trip"
                        value={tripName}
                        onChange={(e) =>
                            setTripName(e.target.value)
                        }
                        required
                    />


                    <label>
                        Destination
                    </label>

                    <input
                        type="text"
                        placeholder="Example: Goa"
                        value={destination}
                        onChange={(e) =>
                            setDestination(e.target.value)
                        }
                        required
                    />


                    <div className="date-row">

                        <div>

                            <label>
                                Start Date
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div>

                            <label>
                                End Date
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                    setEndDate(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                    </div>


                    <label>
                        Total Budget
                    </label>

                    <input
                        type="number"
                        placeholder="Example: 50000"
                        value={budget}
                        onChange={(e) =>
                            setBudget(e.target.value)
                        }
                        min="0"
                        required
                    />


                    {message && (
                        <div className="create-trip-success">
                            {message}
                        </div>
                    )}


                    {error && (
                        <div className="create-trip-error">
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="create-trip-submit"
                    >
                        Create Trip ✈️
                    </button>

                </form>


                <button
                    className="create-trip-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>
    );
}

export default CreateTrip;