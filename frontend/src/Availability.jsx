
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Availability() {
    const { id } = useParams();
    const navigate = useNavigate();

    const savedUser = JSON.parse(
        localStorage.getItem("user")
    );

    const [trip, setTrip] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [available, setAvailable] = useState(true);
    const [availability, setAvailability] = useState([]);
    const [message, setMessage] = useState("");

    const loadTrip = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/trips/${id}`
            );

            const data = await response.json();

            if (response.ok) {
                setTrip(data);
            }
        } catch (error) {
            console.log("Trip loading error:", error);
        }
    };

    const loadAvailability = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/availability/trip/${id}`
            );

            const data = await response.json();

            if (response.ok) {
                setAvailability(
                    data.availability || []
                );
            }
        } catch (error) {
            console.log(
                "Availability loading error:",
                error
            );
        }
    };

    useEffect(() => {
        loadTrip();
        loadAvailability();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");

        if (!selectedDate) {
            setMessage("Please select a date.");
            return;
        }

        if (!savedUser || !savedUser._id) {
            setMessage(
                "User information not found. Please login again."
            );
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/availability/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tripId: id,
                        userId: savedUser._id,
                        date: selectedDate,
                        available: available
                    })
                }
            );

            const data = await response.json();

            console.log(
                "Availability response:",
                data
            );

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Failed to save availability."
                );
                return;
            }

            setMessage(
                "Availability saved successfully!"
            );

            setSelectedDate("");

            await loadAvailability();

        } catch (error) {
            console.log(
                "Save availability error:",
                error
            );

            setMessage(
                "Unable to connect to the server."
            );
        }
    };

    /*
        Find the crew member's name using
        the members already loaded with the trip.
    */
    const getMemberName = (userId) => {

        if (!trip || !trip.members) {
            return "Crew Member";
        }

        const member = trip.members.find((person) => {

            const memberId =
                typeof person === "object"
                    ? person._id
                    : person;

            const availabilityUserId =
                typeof userId === "object"
                    ? userId._id
                    : userId;

            return memberId === availabilityUserId;
        });

        if (member && typeof member === "object") {
            return member.name || "Crew Member";
        }

        if (
            userId === savedUser?._id
        ) {
            return savedUser?.name || "You";
        }

        return "Crew Member";
    };

    if (!trip) {
        return (
            <div className="availability-page">

                <div className="availability-container">

                    <p>
                        Loading availability...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="availability-page">

            <div className="availability-container">

                <button
                    className="availability-back-btn"
                    onClick={() =>
                        navigate(`/trip/${id}`)
                    }
                >
                    ← Back to Trip
                </button>

                <div className="availability-header">

                    <div className="availability-icon">
                        📅
                    </div>

                    <div>

                        <h1>
                            Availability
                        </h1>

                        <p>
                            Check when your crew is available for the trip.
                        </p>

                    </div>

                </div>

                <div className="availability-trip-card">

                    <h2>
                        {trip.tripName}
                    </h2>

                    <p>
                        📍 {trip.destination}
                    </p>

                </div>

                <div className="availability-card">

                    <h2>
                        Add Your Availability
                    </h2>

                    <p className="availability-description">
                        Select a date and tell your crew if you are available.
                    </p>

                    <form
                        className="availability-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="availability-field">

                            <label>
                                Date
                            </label>

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(event) =>
                                    setSelectedDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="availability-field">

                            <label>
                                Your Status
                            </label>

                            <select
                                value={
                                    available
                                        ? "Available"
                                        : "Not Available"
                                }
                                onChange={(event) =>
                                    setAvailable(
                                        event.target.value ===
                                        "Available"
                                    )
                                }
                            >

                                <option value="Available">
                                    Available
                                </option>

                                <option value="Not Available">
                                    Not Available
                                </option>

                            </select>

                        </div>

                        <button
                            className="availability-save-btn"
                            type="submit"
                        >
                            Save Availability
                        </button>

                    </form>

                    {message && (
                        <p className="availability-message">
                            {message}
                        </p>
                    )}

                </div>

                <div className="availability-card">

                    <h2>
                        Crew Availability
                    </h2>

                    {availability.length === 0 ? (

                        <div className="availability-empty">

                            <div>
                                📅
                            </div>

                            <p>
                                No availability has been added yet.
                            </p>

                        </div>

                    ) : (

                        <div className="availability-list">

                            {availability.map((item) => {

                                const memberName =
                                    getMemberName(
                                        item.userId
                                    );

                                return (
                                    <div
                                        className="availability-item"
                                        key={item._id}
                                    >

                                        <div className="availability-member">

                                            <div className="availability-avatar">

                                                {memberName
                                                    ? memberName
                                                        .charAt(0)
                                                        .toUpperCase()
                                                    : "U"}

                                            </div>

                                            <div>

                                                <strong>
                                                    {memberName}
                                                </strong>

                                                <small>
                                                    {new Date(
                                                        item.date
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </small>

                                            </div>

                                        </div>

                                        <span
                                            className={
                                                item.available
                                                    ? "availability-status available"
                                                    : "availability-status unavailable"
                                            }
                                        >
                                            {item.available
                                                ? "Available"
                                                : "Not Available"}
                                        </span>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Availability;

