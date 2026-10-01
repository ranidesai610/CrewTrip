
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TravelJournal() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [journals, setJournals] = useState([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // =========================
    // GET JOURNAL ENTRIES
    // =========================

    const getJournals = async () => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/journals/trip/${id}`
            );

            const data = await response.json();

            console.log("JOURNALS:", data);

            if (response.ok) {

                setJournals(
                    data.journals || []
                );

            }

        } catch (error) {

            console.log(
                "Failed to get journals:",
                error
            );

        }

    };

    // =========================
    // LOAD JOURNALS
    // =========================

    useEffect(() => {

        const loadJournals = async () => {

            setLoading(true);

            await getJournals();

            setLoading(false);

        };

        loadJournals();

    }, [id]);

    // =========================
    // CREATE JOURNAL
    // =========================

    const handleCreateJournal = async (event) => {

        event.preventDefault();

        if (!title.trim()) {

            alert("Please enter a title.");

            return;
        }

        if (!content.trim()) {

            alert("Please enter your journal entry.");

            return;
        }

        if (!user || !user._id) {

            alert("Please login first.");

            navigate("/login");

            return;
        }

        try {

            setSaving(true);

            const response = await fetch(
                "http://localhost:5000/api/journals/create",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        tripId: id,

                        userId: user._id,

                        title: title.trim(),

                        content: content.trim()

                    })
                }
            );

            const data = await response.json();

            console.log(
                "CREATE JOURNAL:",
                data
            );

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to create journal entry."
                );

                return;
            }

            alert(
                "Journal entry added successfully!"
            );

            setTitle("");
            setContent("");

            await getJournals();

        } catch (error) {

            console.log(
                "CREATE JOURNAL ERROR:",
                error
            );

            alert(
                "Something went wrong."
            );

        } finally {

            setSaving(false);

        }

    };

    // =========================
    // DELETE JOURNAL
    // =========================

    const handleDelete = async (journalId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this journal entry?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/journals/${journalId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to delete journal entry."
                );

                return;
            }

            await getJournals();

        } catch (error) {

            console.log(
                "DELETE JOURNAL ERROR:",
                error
            );

        }

    };

    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="journal-loading">
                Loading travel journal...
            </div>
        );

    }

    // =========================
    // PAGE
    // =========================

    return (

        <div className="journal-page">

            <div className="journal-container">

                {/* BACK BUTTON */}

                <button
                    className="journal-back-btn"
                    onClick={() =>
                        navigate(`/trip/${id}`)
                    }
                >
                    ← Back to Trip
                </button>


                {/* HERO */}

                <div className="journal-hero">

                    <div className="journal-hero-icon">
                        📖
                    </div>

                    <div>

                        <h1>
                            Travel Journal
                        </h1>

                        <p>
                            Save your favorite memories and moments from the trip.
                        </p>

                    </div>

                </div>


                {/* ADD MEMORY */}

                <div className="journal-write-card">

                    <div className="journal-write-heading">

                        <div>

                            <h2>
                                Add a Memory
                            </h2>

                            <p>
                                Write something you want your crew to remember.
                            </p>

                        </div>

                        <div className="journal-write-icon">
                            ✨
                        </div>

                    </div>


                    <form
                        className="journal-form"
                        onSubmit={handleCreateJournal}
                    >

                        <input
                            className="journal-title-input"
                            type="text"
                            placeholder="Memory title"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                        />


                        <textarea
                            className="journal-content-input"
                            placeholder="Write about your memory..."
                            value={content}
                            onChange={(event) =>
                                setContent(event.target.value)
                            }
                            rows="6"
                        />


                        <div className="journal-form-bottom">

                            <span>
                                ✍️ Write down your favorite moment
                            </span>

                            <button
                                type="submit"
                                className="journal-add-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Add Memory"
                                }
                            </button>

                        </div>

                    </form>

                </div>


                {/* TRIP MEMORIES */}

                <div className="journal-memories-section">

                    <div className="journal-memories-heading">

                        <div>

                            <h2>
                                Trip Memories
                            </h2>

                            <p>
                                All the special moments from your trip.
                            </p>

                        </div>

                        <span>
                            {journals.length}{" "}
                            {journals.length === 1
                                ? "Memory"
                                : "Memories"
                            }
                        </span>

                    </div>


                    {journals.length === 0 ? (

                        <div className="journal-empty">

                            <div className="journal-empty-icon">
                                📖
                            </div>

                            <h3>
                                No memories yet
                            </h3>

                            <p>
                                Add your first travel memory above.
                            </p>

                        </div>

                    ) : (

                        <div className="journal-grid">

                            {journals.map(
                                (journal) => (

                                    <div
                                        key={journal._id}
                                        className="journal-memory-card"
                                    >

                                        {/* CARD TOP */}

                                        <div className="journal-card-top">

                                            <div className="journal-card-icon">
                                                📍
                                            </div>

                                            <button
                                                className="journal-delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        journal._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>


                                        {/* TITLE */}

                                        <h3>
                                            {journal.title}
                                        </h3>


                                        {/* CONTENT */}

                                        <p>
                                            {journal.content}
                                        </p>


                                        {/* DATE */}

                                        <div className="journal-card-date">

                                            📅{" "}
                                            {new Date(
                                                journal.createdAt
                                            ).toLocaleDateString()}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default TravelJournal;

