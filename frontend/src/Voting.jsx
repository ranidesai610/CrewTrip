import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Voting() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [polls, setPolls] = useState([]);

    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    // =========================
    // GET TRIP
    // =========================

    const getTrip = async () => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/trips/${id}`
            );

            const data = await response.json();

            console.log("TRIP DATA:", data);

            if (response.ok) {
                setTrip(data.trip || data);
            }

        } catch (error) {

            console.log("Failed to get trip:", error);

        }

    };

    // =========================
    // GET POLLS
    // =========================

    const getPolls = async () => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/polls/trip/${id}`
            );

            const data = await response.json();

            console.log("POLLS FROM BACKEND:", data);

            // Temporary debugging
            if (response.ok) {

                if (data.polls) {

                    setPolls(data.polls);

                } else if (Array.isArray(data)) {

                    setPolls(data);

                } else {

                    setPolls([]);

                }

            } else {

                console.log(
                    "Failed to load polls:",
                    data
                );

            }

        } catch (error) {

            console.log(
                "Error getting polls:",
                error
            );

        }

    };

    // =========================
    // LOAD PAGE
    // =========================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await getTrip();
            await getPolls();

            setLoading(false);

        };

        loadData();

    }, [id]);

    // =========================
    // ADD OPTION
    // =========================

    const addOption = () => {

        setOptions([
            ...options,
            ""
        ]);

    };

    // =========================
    // REMOVE OPTION
    // =========================

    const removeOption = (index) => {

        if (options.length <= 2) {
            return;
        }

        const newOptions = options.filter(
            (_, optionIndex) => optionIndex !== index
        );

        setOptions(newOptions);

    };

    // =========================
    // CHANGE OPTION
    // =========================

    const updateOption = (index, value) => {

        const newOptions = [...options];

        newOptions[index] = value;

        setOptions(newOptions);

    };

    // =========================
    // CREATE POLL
    // =========================

    const handleCreatePoll = async (event) => {

        event.preventDefault();

        console.log("CREATE POLL BUTTON CLICKED");

        if (!question.trim()) {

            alert("Please enter a question.");

            return;
        }

        const validOptions = options.filter(
            option => option.trim() !== ""
        );

        if (validOptions.length < 2) {

            alert("Please enter at least 2 options.");

            return;
        }

        if (!user || !user._id) {

            alert("Please login first.");

            navigate("/login");

            return;
        }

        try {

            setCreating(true);

            const response = await fetch(
                "http://localhost:5000/api/polls/create",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        tripId: id,

                        question: question.trim(),

                        options: validOptions.map(
                            option => ({
                                text: option.trim()
                            })
                        ),

                        createdBy: user._id

                    })
                }
            );

            const data = await response.json();

            console.log(
                "CREATE POLL RESPONSE:",
                data
            );

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to create poll."
                );

                return;
            }

            alert("Poll created successfully!");

            setQuestion("");

            setOptions([
                "",
                ""
            ]);

            // IMPORTANT:
            // Load polls again after creating
            await getPolls();

        } catch (error) {

            console.log(
                "CREATE POLL ERROR:",
                error
            );

            alert(
                "Something went wrong while creating the poll."
            );

        } finally {

            setCreating(false);

        }

    };

    // =========================
    // VOTE
    // =========================

    const handleVote = async (
        pollId,
        optionId
    ) => {

        if (!user || !user._id) {

            alert("Please login first.");

            navigate("/login");

            return;
        }

        try {

           const response = await fetch(
    `http://localhost:5000/api/polls/${pollId}/vote`,
    {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            userId: user._id,
            optionId: optionId
        })
    }
);

            const data = await response.json();

            console.log(
                "VOTE RESPONSE:",
                data
            );

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to vote."
                );

                return;
            }

            alert("Vote submitted successfully!");

            await getPolls();

        } catch (error) {

            console.log(
                "VOTE ERROR:",
                error
            );

            alert(
                "Something went wrong while voting."
            );

        }

    };

    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center"
                }}
            >
                Loading voting...
            </div>
        );

    }

    // =========================
    // PAGE
    // =========================

    return (

        <div className="trip-page">

            <div className="trip-container">

                {/* BACK BUTTON */}

                <button
                    onClick={() => navigate(`/trip/${id}`)}
                    style={{
                        marginBottom: "20px",
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "10px",
                        background: "#eeeeF5",
                        cursor: "pointer"
                    }}
                >
                    ← Back to Trip
                </button>

                {/* HEADER */}

                <div
                    className="trip-header"
                    style={{
                        marginBottom: "25px"
                    }}
                >

                    <h1>
                        🗳️ Voting
                    </h1>

                    <p>
                        {trip
                            ? `Create polls and vote with your crew for ${trip.tripName}.`
                            : "Create polls and vote with your crew."
                        }
                    </p>

                </div>

                {/* CREATE POLL */}

                <div
                    className="trip-feature-card"
                    style={{
                        cursor: "default",
                        marginBottom: "30px"
                    }}
                >

                    <h2>
                        Create a Poll
                    </h2>

                    <p>
                        Ask your group a question and let everyone vote.
                    </p>

                    <form
                        className="timeline-form"
                        onSubmit={handleCreatePoll}
                    >

                        {/* QUESTION */}

                        <input
                            type="text"
                            placeholder="Enter your question"
                            value={question}
                            onChange={(event) =>
                                setQuestion(event.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginBottom: "15px",
                                borderRadius: "10px",
                                border: "1px solid #ddd",
                                boxSizing: "border-box"
                            }}
                        />

                        {/* OPTIONS */}

                        {options.map(
                            (option, index) => (

                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        marginBottom: "10px"
                                    }}
                                >

                                    <input
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        value={option}
                                        onChange={(event) =>
                                            updateOption(
                                                index,
                                                event.target.value
                                            )
                                        }
                                        style={{
                                            flex: 1,
                                            padding: "12px",
                                            borderRadius: "10px",
                                            border: "1px solid #ddd"
                                        }}
                                    />

                                    {options.length > 2 && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeOption(index)
                                            }
                                            style={{
                                                border: "none",
                                                background: "#ffe5e5",
                                                borderRadius: "10px",
                                                padding: "0 12px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            ✕
                                        </button>

                                    )}

                                </div>

                            )
                        )}

                        {/* ADD OPTION */}

                        <button
                            type="button"
                            onClick={addOption}
                            style={{
                                marginBottom: "15px",
                                padding: "10px 14px",
                                borderRadius: "10px",
                                border: "1px solid #ddd",
                                background: "white",
                                cursor: "pointer"
                            }}
                        >
                            + Add Option
                        </button>

                        <br />

                        {/* CREATE */}

                        <button
                            type="submit"
                            className="save-timeline-btn"
                            disabled={creating}
                        >

                            {creating
                                ? "Creating..."
                                : "Create Poll"
                            }

                        </button>

                    </form>

                </div>

                {/* EXISTING POLLS */}

                <div>

                    <h2>
                        Active Polls
                    </h2>

                    {polls.length === 0 ? (

                        <div
                            className="trip-feature-card"
                            style={{
                                cursor: "default",
                                marginTop: "15px"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "40px",
                                    marginBottom: "10px"
                                }}
                            >
                                🗳️
                            </div>

                            <h3>
                                No polls yet
                            </h3>

                            <p>
                                Create the first poll for your trip.
                            </p>

                        </div>

                    ) : (

                        polls.map(
                            (poll) => (

                                <div
                                    key={poll._id}
                                    className="trip-feature-card"
                                    style={{
                                        cursor: "default",
                                        marginTop: "15px"
                                    }}
                                >

                                    <h3>
                                        {poll.question}
                                    </h3>

                                    <p>
                                        Vote for one option:
                                    </p>

                                    {poll.options &&
                                        poll.options.map(
                                            (option) => (

                                                <button
                                                    key={option._id}
                                                    onClick={() =>
                                                        handleVote(
                                                            poll._id,
                                                            option._id
                                                        )
                                                    }
                                                    style={{
                                                        display: "block",
                                                        width: "100%",
                                                        marginBottom: "10px",
                                                        padding: "12px",
                                                        borderRadius: "10px",
                                                        border: "1px solid #ddd",
                                                        background: "white",
                                                        cursor: "pointer",
                                                        textAlign: "left"
                                                    }}
                                                >

                                                    <span>
                                                        {option.text}
                                                    </span>

                                                    <strong
                                                        style={{
                                                            float: "right"
                                                        }}
                                                    >
                                                        {option.votes?.length || 0}
                                                    </strong>

                                                </button>

                                            )
                                        )}

                                </div>

                            )
                        )

                    )}

                </div>

            </div>

        </div>

    );

}

export default Voting;