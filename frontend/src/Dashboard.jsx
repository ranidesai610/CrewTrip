
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const [inviteCode, setInviteCode] = useState("");
    const [joinMessage, setJoinMessage] = useState("");
    const [joining, setJoining] = useState(false);

    useEffect(() => {

        const getTrips = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/trips"
                );

                const data = await response.json();

                console.log("Trips from backend:", data);

                if (
                    data.trips &&
                    Array.isArray(data.trips)
                ) {

                    const userTrips = data.trips.filter((trip) => {

                        const createdById =
                            typeof trip.createdBy === "object"
                                ? trip.createdBy?._id
                                : trip.createdBy;

                        const isCreator =
                            createdById === user?._id;

                        const isMember =
                            trip.members &&
                            trip.members.some((member) => {

                                const memberId =
                                    typeof member === "object"
                                        ? member._id
                                        : member;

                                return memberId === user?._id;
                            });

                        return isCreator || isMember;

                    });

                    setTrips(userTrips);

                } else {

                    setTrips([]);

                }

            } catch (error) {

                console.log(
                    "Failed to load trips:",
                    error
                );

                setTrips([]);

            } finally {

                setLoading(false);

            }
        };

        if (user?._id) {
            getTrips();
        } else {
            setTrips([]);
            setLoading(false);
        }

    }, []);

    const trip =
        trips.length > 0
            ? trips[0]
            : null;

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getTripDays = (startDate, endDate) => {

        if (!startDate || !endDate) {
            return "-";
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const difference =
            end.getTime() - start.getTime();

        return Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );
    };

    const handleJoinTrip = async () => {

        if (!inviteCode.trim()) {

            setJoinMessage(
                "Please enter an invite code."
            );

            return;
        }

        if (!user?._id) {

            setJoinMessage(
                "Please login first."
            );

            return;
        }

        setJoining(true);
        setJoinMessage("");

        try {

            const response = await fetch(
                "http://localhost:5000/api/trips/join",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        inviteCode:
                            inviteCode.trim().toUpperCase(),
                        userId: user._id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setJoinMessage(
                    data.message ||
                    "Unable to join trip."
                );

                return;
            }

            setJoinMessage(
                "Joined trip successfully! 🎉"
            );

            setInviteCode("");

            const tripsResponse = await fetch(
                "http://localhost:5000/api/trips"
            );

            const tripsData =
                await tripsResponse.json();

            if (
                tripsData.trips &&
                Array.isArray(tripsData.trips)
            ) {

                const userTrips =
                    tripsData.trips.filter((trip) => {

                        const createdById =
                            typeof trip.createdBy === "object"
                                ? trip.createdBy?._id
                                : trip.createdBy;

                        const isCreator =
                            createdById === user?._id;

                        const isMember =
                            trip.members &&
                            trip.members.some((member) => {

                                const memberId =
                                    typeof member === "object"
                                        ? member._id
                                        : member;

                                return (
                                    memberId === user?._id
                                );
                            });

                        return isCreator || isMember;

                    });

                setTrips(userTrips);
            }

        } catch (error) {

            console.log(
                "Join trip error:",
                error
            );

            setJoinMessage(
                "Unable to connect to the server."
            );

        } finally {

            setJoining(false);

        }
    };

    const handleLogout = () => {

        localStorage.removeItem("user");

        navigate("/login");

    };

    return (

        <div className="dashboard-page">

            {/* =========================================
                NAVBAR
            ========================================= */}

            <nav className="dashboard-navbar">

                <div
                    className="dashboard-logo"
                    onClick={() => navigate("/")}
                >
                    ✈️ CrewTrip
                </div>

                <div className="dashboard-user">

                    <div
                        className="user-avatar"
                        onClick={() =>
                            navigate("/profile")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        {user?.name
                            ? user.name
                                .charAt(0)
                                .toUpperCase()
                            : "U"}

                    </div>

                    <div
                        onClick={() =>
                            navigate("/profile")
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <strong>
                            {user?.name || "User"}
                        </strong>

                        <small>
                            Crew Member
                        </small>

                    </div>

                    <button
                        onClick={() =>
                            navigate("/profile")
                        }
                        className="profile-nav-btn"
                    >
                        Profile
                    </button>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <main className="dashboard-content">

                {/* =====================================
                    WELCOME
                ===================================== */}

                <section className="welcome">

                    <p className="section-label">
                        YOUR CREWTRIP
                    </p>

                    <h1>
                        Welcome back,{" "}
                        {user?.name || "Traveler"} 👋
                    </h1>

                    <p>
                        Plan your trips, manage your crew
                        and get ready for your next adventure.
                    </p>

                </section>


                {/* =====================================
                    JOIN TRIP
                ===================================== */}

                <section className="dashboard-join-section">

                    <div className="dashboard-card join-trip-card">

                        <div className="dashboard-card-icon blue">
                            🔗
                        </div>

                        <h3>
                            Join a Trip
                        </h3>

                        <p>
                            Have an invite code from your
                            travel crew? Enter it below to
                            join their trip.
                        </p>

                        <div className="join-trip-form">

                            <input
                                type="text"
                                placeholder="Enter invite code"
                                value={inviteCode}
                                onChange={(event) =>
                                    setInviteCode(
                                        event.target.value
                                    )
                                }
                            />

                            <button
                                className="open-trip-btn"
                                onClick={handleJoinTrip}
                                disabled={joining}
                            >
                                {joining
                                    ? "Joining..."
                                    : "Join Trip"}
                            </button>

                        </div>

                        {joinMessage && (

                            <p className="join-trip-message">
                                {joinMessage}
                            </p>

                        )}

                    </div>

                </section>


                {/* =====================================
                    UPCOMING TRIP
                ===================================== */}

                <section className="upcoming-trip">

                    <div className="section-heading">

                        <div>

                            <span>
                                UPCOMING TRIP
                            </span>

                            <h2>
                                Your next adventure
                            </h2>

                        </div>

                    </div>


                    {loading ? (

                        <div className="dashboard-card">

                            <h3>
                                Loading your trips...
                            </h3>

                        </div>

                    ) : trip ? (

                        <div className="trip-banner">

                            <div className="trip-info">

                                <small>

                                    {formatDate(
                                        trip.startDate
                                    )}

                                    {" → "}

                                    {formatDate(
                                        trip.endDate
                                    )}

                                </small>

                                <h2>
                                    {trip.tripName}
                                </h2>

                                <p>
                                    📍 {trip.destination}
                                </p>

                                <div className="trip-meta">

                                    <span>
                                        👥{" "}
                                        {trip.members
                                            ? trip.members.length
                                            : 0}{" "}
                                        members
                                    </span>

                                    <span>
                                        📅{" "}
                                        {getTripDays(
                                            trip.startDate,
                                            trip.endDate
                                        )}{" "}
                                        days
                                    </span>

                                    <span>
                                        💰 ₹
                                        {Number(
                                            trip.totalBudget || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>

                            </div>

                            <div className="trip-action">

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/trip/${trip._id}`
                                        )
                                    }
                                >
                                    Open Trip →
                                </button>

                            </div>

                        </div>

                    ) : (

                        <div className="dashboard-card">

                            <div className="dashboard-card-icon purple">
                                ✈️
                            </div>

                            <h3>
                                No trips yet
                            </h3>

                            <p>
                                Create your first trip and
                                start planning with your crew.
                            </p>

                            <button
                                className="open-trip-btn"
                                onClick={() =>
                                    navigate(
                                        "/create-trip"
                                    )
                                }
                            >
                                + Create Your First Trip
                            </button>

                        </div>

                    )}

                </section>


                {/* =====================================
                    MY TRIPS
                ===================================== */}

                <section className="my-trips-section">

                    <div className="section-heading">

                        <div>

                            <span>
                                MY TRIPS
                            </span>

                            <h2>
                                All your adventures
                            </h2>

                        </div>

                        <button
                            className="create-trip-dashboard-btn"
                            onClick={() =>
                                navigate(
                                    "/create-trip"
                                )
                            }
                        >
                            + Create New Trip
                        </button>

                    </div>


                    {loading ? (

                        <div className="dashboard-card">

                            <p>
                                Loading trips...
                            </p>

                        </div>

                    ) : trips.length === 0 ? (

                        <div className="dashboard-card">

                            <div className="dashboard-card-icon blue">
                                🗺️
                            </div>

                            <h3>
                                No trips found
                            </h3>

                            <p>
                                Your created and joined trips
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="my-trips-grid">

                            {trips.map((trip) => (

                                <div
                                    className="my-trip-card"
                                    key={trip._id}
                                >

                                    <div className="my-trip-top">

                                        <div>

                                            <small>
                                                DESTINATION
                                            </small>

                                            <h3>
                                                {trip.tripName}
                                            </h3>

                                        </div>

                                        <span>
                                            📍{" "}
                                            {trip.destination}
                                        </span>

                                    </div>

                                    <p className="my-trip-date">

                                        📅{" "}

                                        {formatDate(
                                            trip.startDate
                                        )}

                                        {" → "}

                                        {formatDate(
                                            trip.endDate
                                        )}

                                    </p>

                                    <div className="my-trip-details">

                                        <div>

                                            <small>
                                                MEMBERS
                                            </small>

                                            <strong>
                                                👥{" "}
                                                {trip.members
                                                    ? trip.members.length
                                                    : 0}
                                            </strong>

                                        </div>

                                        <div>

                                            <small>
                                                DAYS
                                            </small>

                                            <strong>
                                                {getTripDays(
                                                    trip.startDate,
                                                    trip.endDate
                                                )}
                                            </strong>

                                        </div>

                                        <div>

                                            <small>
                                                BUDGET
                                            </small>

                                            <strong>
                                                ₹
                                                {Number(
                                                    trip.totalBudget || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                    <button
                                        className="open-trip-btn"
                                        onClick={() =>
                                            navigate(
                                                `/trip/${trip._id}`
                                            )
                                        }
                                    >
                                        Open Trip →
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* =====================================
                    FEATURE CARDS
                ===================================== */}

                <section>

                    <div className="section-heading">

                        <div>

                            <span>
                                PLAN TOGETHER
                            </span>

                            <h2>
                                Everything for your trip
                            </h2>

                        </div>

                    </div>


                    <div className="dashboard-grid">

                        {/* TIMELINE */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-icon purple">
                                🗓️
                            </div>

                            <h3>
                                Trip Timeline
                            </h3>

                            <p>
                                Organize your activities,
                                places and plans in one timeline.
                            </p>

                        </div>


                        {/* EXPENSES */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-icon orange">
                                💰
                            </div>

                            <h3>
                                Shared Expenses
                            </h3>

                            <p>
                                Track group spending and
                                split expenses easily.
                            </p>

                        </div>


                        {/* PACKING */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-icon blue">
                                🎒
                            </div>

                            <h3>
                                Packing List
                            </h3>

                            <p>
                                Keep track of everything
                                your crew needs to pack.
                            </p>

                        </div>


                        {/* GROUP CHAT */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-icon green">
                                💬
                            </div>

                            <h3>
                                Group Chat
                            </h3>

                            <p>
                                Stay connected with your
                                travel crew.
                            </p>

                        </div>


                        {/* VOTING */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-icon pink">
                                🗳️
                            </div>

                            <h3>
                                Group Voting
                            </h3>

                            <p>
                                Let your crew vote on
                                destinations and plans.
                            </p>

                        </div>


                        {/* TRAVEL JOURNAL */}

                        <div className="dashboard-card">

                            <div className="dashboard-card-icon yellow">
                                📸
                            </div>

                            <h3>
                                Travel Journal
                            </h3>

                            <p>
                                Save your favorite moments
                                and memories from the trip.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =====================================
                    INVITE CREW
                ===================================== */}

                {trip && trip.inviteCode && (

                    <section className="invite-card">

                        <div>

                            <span>
                                INVITE YOUR CREW
                            </span>

                            <h2>
                                Bring your friends along ✈️
                            </h2>

                            <p>
                                Share this invite code with
                                your friends so they can join
                                your trip.
                            </p>

                        </div>

                        <div className="invite-code">

                            {trip.inviteCode}

                        </div>

                    </section>

                )}

            </main>

        </div>
    );
}

export default Dashboard;

