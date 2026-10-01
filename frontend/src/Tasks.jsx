
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Tasks() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [trip, setTrip] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // =========================
    // GET TRIP
    // =========================

    const getTrip = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/trips/${id}`
            );

            const data = await response.json();

            if (response.ok) {
                setTrip(data);
            }
        } catch (error) {
            console.log("Failed to load trip:", error);
        }
    };

    // =========================
    // GET TASKS
    // =========================

    const getTasks = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/trip/${id}`
            );

            const data = await response.json();

            if (response.ok) {
                setTasks(data.tasks || []);
            }
        } catch (error) {
            console.log("Failed to load tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTrip();
        getTasks();
    }, [id]);

    // =========================
    // ADD TASK
    // =========================

    const handleAddTask = async (event) => {
        event.preventDefault();

        setMessage("");

        if (!title.trim()) {
            setMessage("Please enter a task title.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/tasks/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tripId: id,
                        title: title.trim(),
                        description: description.trim(),
                        assignedTo: assignedTo || null,
                        dueDate: dueDate || null
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Failed to create task."
                );
                return;
            }

            setTitle("");
            setDescription("");
            setAssignedTo("");
            setDueDate("");

            setShowForm(false);

            setMessage("Task added successfully!");

            await getTasks();

        } catch (error) {
            console.log("Create task error:", error);

            setMessage(
                "Unable to connect to the server."
            );
        }
    };

    // =========================
    // UPDATE TASK STATUS
    // =========================

    const handleTaskStatus = async (task) => {
        const newStatus =
            task.status === "completed"
                ? "pending"
                : "completed";

        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${task._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            if (response.ok) {
                await getTasks();
            }
        } catch (error) {
            console.log(
                "Update task error:",
                error
            );
        }
    };

    // =========================
    // DELETE TASK
    // =========================

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${taskId}`,
                {
                    method: "DELETE"
                }
            );

            if (response.ok) {
                setMessage("Task deleted successfully!");
                await getTasks();
            }
        } catch (error) {
            console.log(
                "Delete task error:",
                error
            );
        }
    };

    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {
        if (!date) {
            return "No due date";
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
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="tasks-page">
                <div className="tasks-container">
                    <h2>Loading tasks...</h2>
                </div>
            </div>
        );
    }

    // =========================
    // PAGE
    // =========================

    return (
        <div className="tasks-page">

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
                        navigate(`/trip/${id}`)
                    }
                >
                    ← Trip Details
                </button>

            </nav>


            <main className="tasks-container">

                {/* BACK BUTTON */}

                <button
                    className="back-trip-btn"
                    onClick={() =>
                        navigate(`/trip/${id}`)
                    }
                >
                    ← Back to Trip
                </button>


                {/* HEADER */}

                <div className="tasks-header">

                    <div>

                        <span>
                            TRIP PLANNING
                        </span>

                        <h1>
                            {trip?.tripName || "Trip"} Tasks
                        </h1>

                        <p>
                            Organize responsibilities
                            and keep your crew on track.
                        </p>

                    </div>

                    <button
                        className="add-task-btn"
                        onClick={() =>
                            setShowForm(!showForm)
                        }
                    >
                        {showForm
                            ? "✕ Cancel"
                            : "+ Add Task"}
                    </button>

                </div>


                {/* MESSAGE */}

                {message && (
                    <div className="task-message">
                        {message}
                    </div>
                )}


                {/* ADD TASK FORM */}

                {showForm && (
                    <form
                        className="task-form"
                        onSubmit={handleAddTask}
                    >

                        <h2>
                            Add New Task
                        </h2>

                        <label>
                            Task Title
                        </label>

                        <input
                            type="text"
                            placeholder="Example: Book Hotel"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            required
                        />

                        <label>
                            Description
                        </label>

                        <textarea
                            placeholder="Enter task details..."
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            rows="3"
                        />

                        <label>
                            Assign To
                        </label>

                        <select
                            value={assignedTo}
                            onChange={(event) =>
                                setAssignedTo(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                Select crew member
                            </option>

                            {trip?.members?.map(
                                (member) => (
                                    <option
                                        key={member._id}
                                        value={member._id}
                                    >
                                        {member.name}
                                    </option>
                                )
                            )}

                        </select>

                        <label>
                            Due Date
                        </label>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(event) =>
                                setDueDate(
                                    event.target.value
                                )
                            }
                        />

                        <button
                            type="submit"
                            className="save-task-btn"
                        >
                            Add Task
                        </button>

                    </form>
                )}


                {/* TASK LIST */}

                {tasks.length > 0 ? (

                    <div className="task-list">

                        {tasks.map((task) => {

                            const assignedMember =
                                trip?.members?.find(
                                    (member) =>
                                        member._id ===
                                        task.assignedTo
                                );

                            return (
                                <div
                                    className={`task-card ${
                                        task.status ===
                                        "completed"
                                            ? "task-completed"
                                            : ""
                                    }`}
                                    key={task._id}
                                >

                                    <div className="task-check">

                                        <button
                                            onClick={() =>
                                                handleTaskStatus(
                                                    task
                                                )
                                            }
                                        >
                                            {task.status ===
                                            "completed"
                                                ? "✓"
                                                : "○"}
                                        </button>

                                    </div>


                                    <div className="task-content">

                                        <h3>
                                            {task.title}
                                        </h3>

                                        {task.description && (
                                            <p>
                                                {task.description}
                                            </p>
                                        )}

                                        <div className="task-details">

                                            <span>
                                                👤{" "}
                                                {assignedMember
                                                    ? assignedMember.name
                                                    : "Unassigned"}
                                            </span>

                                            <span>
                                                📅{" "}
                                                {formatDate(
                                                    task.dueDate
                                                )}
                                            </span>

                                        </div>

                                    </div>


                                    <button
                                        className="delete-task-btn"
                                        onClick={() =>
                                            handleDeleteTask(
                                                task._id
                                            )
                                        }
                                    >
                                        🗑️
                                    </button>

                                </div>
                            );
                        })}

                    </div>

                ) : (

                    <div className="empty-tasks">

                        <span>
                            📋
                        </span>

                        <h2>
                            No tasks yet
                        </h2>

                        <p>
                            Add your first task to
                            organize your trip.
                        </p>

                    </div>

                )}

            </main>

        </div>
    );
}

export default Tasks;

