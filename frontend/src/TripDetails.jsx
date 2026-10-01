
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TripDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    // Timeline form
    const [showTimelineForm, setShowTimelineForm] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [timelineMessage, setTimelineMessage] = useState("");
    const [addingActivity, setAddingActivity] = useState(false);


    // =========================
    // GET TRIP DETAILS
    // =========================

    const getTrip = async () => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/trips/${id}`
            );

            const data = await response.json();

            console.log(
                "Trip details:",
                data
            );

            if (response.ok) {
                setTrip(data);
            }

        } catch (error) {

            console.log(
                "Failed to load trip:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        getTrip();

    }, [id]);


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    };


    // =========================
    // ADD TIMELINE ACTIVITY
    // =========================

    const handleAddActivity = async (e) => {

        e.preventDefault();

        setTimelineMessage("");
        setAddingActivity(true);

        try {

            const response = await fetch(
                `http://localhost:5000/api/trips/${id}/timeline`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title: title,
                        date: date,
                        description: description
                    })
                }
            );

            const data = await response.json();

            console.log(
                "Timeline response:",
                data
            );

            if (response.ok) {

                setTitle("");
                setDate("");
                setDescription("");

                setShowTimelineForm(false);

                setTimelineMessage(
                    "Activity added successfully!"
                );

                await getTrip();

            } else {

                setTimelineMessage(
                    data.message ||
                    "Failed to add activity."
                );

            }

        } catch (error) {

            console.log(
                "Failed to add activity:",
                error
            );

            setTimelineMessage(
                "Unable to connect to the server."
            );

        } finally {

            setAddingActivity(false);

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="trip-details-page">

                <div className="trip-details-content">

                    <h2>
                        Loading trip...
                    </h2>

                </div>

            </div>
        );

    }


    // =========================
    // TRIP NOT FOUND
    // =========================

    if (!trip) {

        return (
            <div className="trip-details-page">

                <div className="trip-details-content">

                    <h2>
                        Trip not found
                    </h2>

                    <button
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


    // =========================
    // PAGE
    // =========================

    return (

        <div className="trip-details-page">

            {/* NAVBAR */}

            <nav className="dashboard-navbar">

                <div
                    className="dashboard-logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ✈️ CrewTrip
                </div>

                <button
                    className="logout-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </nav>


            <main className="trip-details-content">

                {/* BACK BUTTON */}

                <button
                    className="back-trip-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Back to My Trips
                </button>


                {/* TRIP HEADER */}

                <section className="trip-details-hero">

                    <div>

                        <span>
                            YOUR ADVENTURE
                        </span>

                        <h1>
                            {trip.tripName}
                        </h1>

                        <p>
                            📍 {trip.destination}
                        </p>

                    </div>


                    {/* INVITE CODE */}

                    <div className="trip-code">

                        <small>
                            INVITE CODE
                        </small>

                        <strong>
                            {trip.inviteCode || "N/A"}
                        </strong>

                    </div>

                </section>


                {/* BASIC INFORMATION */}

                <section className="trip-details-info">

                    {/* DATES */}

                    <div className="trip-info-box">

                        <span>
                            📅 DATES
                        </span>

                        <strong>
                            {formatDate(
                                trip.startDate
                            )}
                        </strong>

                        <p>
                            to{" "}
                            {formatDate(
                                trip.endDate
                            )}
                        </p>

                    </div>


                    {/* CREW */}

                    <div className="trip-info-box crew-info-box">

                        <span>
                            👥 CREW
                        </span>

                        <strong>
                            {trip.members
                                ? trip.members.length
                                : 0}{" "}
                            {trip.members &&
                            trip.members.length === 1
                                ? "Member"
                                : "Members"}
                        </strong>


                        <div className="crew-member-list">

                            {trip.members &&
                            trip.members.length > 0 ? (

                                trip.members.map(
                                    (member) => (

                                        <div
                                            className="crew-member"
                                            key={member._id}
                                        >

                                            <div className="crew-member-avatar">

                                                {member.name
                                                    ? member.name
                                                        .charAt(0)
                                                        .toUpperCase()
                                                    : "U"}

                                            </div>


                                            <div className="crew-member-details">

                                                <strong>
                                                    {member.name ||
                                                        "Unknown Member"}
                                                </strong>

                                                <small>
                                                    Crew Member
                                                </small>

                                            </div>

                                        </div>

                                    )
                                )

                            ) : (

                                <p>
                                    No members yet
                                </p>

                            )}

                        </div>

                    </div>


                    {/* BUDGET */}

                    <div className="trip-info-box">

                        <span>
                            💰 BUDGET
                        </span>

                        <strong>
                            ₹
                            {Number(
                                trip.totalBudget || 0
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                        <p>
                            ₹
                            {Number(
                                trip.spentAmount || 0
                            ).toLocaleString(
                                "en-IN"
                            )}{" "}
                            spent
                        </p>

                    </div>

                </section>


                {/* ========================= */}
                {/* TIMELINE */}
                {/* ========================= */}

                <section className="trip-timeline">

                    <div className="trip-section-heading">

                        <div>

                            <span>
                                ITINERARY
                            </span>

                            <h2>
                                Trip Timeline
                            </h2>

                        </div>


                        <button
                            className="add-timeline-btn"
                            onClick={() =>
                                setShowTimelineForm(
                                    !showTimelineForm
                                )
                            }
                        >

                            {showTimelineForm
                                ? "✕ Cancel"
                                : "+ Add Activity"}

                        </button>

                    </div>


                    {/* MESSAGE */}

                    {timelineMessage && (

                        <div className="timeline-message">

                            {timelineMessage}

                        </div>

                    )}


                    {/* ADD ACTIVITY FORM */}

                    {showTimelineForm && (

                        <form
                            className="timeline-form"
                            onSubmit={
                                handleAddActivity
                            }
                        >

                            <h3>
                                Add Trip Activity
                            </h3>


                            <label>
                                Activity Title
                            </label>

                            <input
                                type="text"
                                placeholder="Example: Visit India Gate"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            <label>
                                Date
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            <label>
                                Description
                            </label>

                            <textarea
                                placeholder="Enter activity details..."
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                rows="3"
                            />


                            <button
                                type="submit"
                                className="save-timeline-btn"
                                disabled={
                                    addingActivity
                                }
                            >

                                {addingActivity
                                    ? "Adding..."
                                    : "Add Activity"}

                            </button>

                        </form>

                    )}


                    {/* TIMELINE LIST */}

                    {trip.timeline &&
                    trip.timeline.length > 0 ? (

                        <div className="timeline-list">

                            {trip.timeline.map(
                                (item) => (

                                    <div
                                        className="timeline-item"
                                        key={item._id}
                                    >

                                        <div className="timeline-dot">
                                            📍
                                        </div>


                                        <div>

                                            <h3>
                                                {item.title}
                                            </h3>

                                            <small>
                                                {formatDate(
                                                    item.date
                                                )}
                                            </small>

                                            <p>
                                                {item.description ||
                                                    "No description"}
                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="empty-timeline">

                            <span>
                                🗓️
                            </span>

                            <h3>
                                No activities yet
                            </h3>

                            <p>
                                Add your first activity
                                to start planning your
                                itinerary.
                            </p>

                        </div>

                    )}

                </section>


                {/* ========================= */}
                {/* FEATURES */}
                {/* ========================= */}

                <section className="trip-features">

                    <div className="trip-section-heading">

                        <span>
                            PLAN YOUR TRIP
                        </span>

                        <h2>
                            Everything in one place
                        </h2>

                    </div>


                    <div className="trip-feature-grid">


                        {/* TIMELINE */}

                        <div className="trip-feature-card">

                            <div>
                                🗓️
                            </div>

                            <h3>
                                Timeline
                            </h3>

                            <p>
                                Organize activities
                                and places to visit.
                            </p>

                        </div>


                        {/* EXPENSES */}

                        <div
                            className="trip-feature-card"
                            onClick={() =>
                                navigate(
                                    `/trip/${id}/expenses`
                                )
                            }
                            style={{
                                cursor: "pointer"
                            }}
                        >

                            <div>
                                💰
                            </div>

                            <h3>
                                Expenses
                            </h3>

                            <p>
                                Track and split
                                group expenses.
                            </p>

                        </div>


                        {/* PACKING */}

                        <div
                            className="trip-feature-card"
                            onClick={() =>
                                navigate(
                                    `/trip/${id}/packing`
                                )
                            }
                            style={{
                                cursor: "pointer"
                            }}
                        >

                            <div>
                                🎒
                            </div>

                            <h3>
                                Packing List
                            </h3>

                            <p>
                                Keep track of things
                                everyone needs.
                            </p>

                        </div>


                        {/* GROUP CHAT */}

                        <div
                            className="trip-feature-card"
                            onClick={() =>
                                navigate(
                                    `/trip/${id}/chat`
                                )
                            }
                            style={{
                                cursor: "pointer"
                            }}
                        >

                            <div>
                                💬
                            </div>

                            <h3>
                                Group Chat
                            </h3>

                            <p>
                                Chat with your crew.
                            </p>

                        </div>


                        {/* VOTING */}

                        <div
                            className="trip-feature-card"
                            onClick={() =>
                                navigate(
                                    `/trip/${id}/voting`
                                )
                            }
                            style={{
                                cursor: "pointer"
                            }}
                        >

                            <div>
                                🗳️
                            </div>

                            <h3>
                                Voting
                            </h3>

                            <p>
                                Vote together on
                                important trip plans.
                            </p>

                        </div>


                        {/* TRAVEL JOURNAL */}

                        <div
                            className="trip-feature-card"
                            onClick={() =>
                                navigate(
                                    `/trip/${id}/journal`
                                )
                            }
                            style={{
                                cursor: "pointer"
                            }}
                        >

                            <div>
                                📖
                            </div>

                            <h3>
                                Travel Journal
                            </h3>

                            <p>
                                Save your trip memories.
                            </p>

                        </div>


                    </div>

                    {/* AVAILABILITY */}

<div
    className="trip-feature-card"
    onClick={() =>
        navigate(
            `/trip/${id}/availability`
        )
    }
    style={{
        cursor: "pointer"
    }}
>

    <div>
        📅
    </div>

    <h3>
        Availability
    </h3>

    <p>
        Check when your crew is available.
    </p>

</div>

<div
    className="trip-feature-card"
    onClick={() =>
        navigate(
            `/trip/${id}/tasks`
        )
    }
    style={{
        cursor: "pointer"
    }}
>
    <div>
        📋
    </div>

    <h3>
        Tasks
    </h3>

    <p>
        Manage tasks and responsibilities
        for your crew.
    </p>
</div>

                </section>

            </main>

        </div>

    );

}

export default TripDetails;

