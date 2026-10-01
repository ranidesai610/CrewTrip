import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Expenses() {

    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [expenses, setExpenses] = useState([]);
    const [trip, setTrip] = useState(null);

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [splitType, setSplitType] = useState("equal");

    const [message, setMessage] = useState("");
    const [addingExpense, setAddingExpense] = useState(false);


    // Get trip details
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

            console.log(
                "Failed to load trip:",
                error
            );

        }
    };


    // Get expenses
    const getExpenses = async () => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/expenses/trip/${id}`
            );

            const data = await response.json();

            console.log(
                "Expenses:",
                data
            );

            if (response.ok) {

                if (Array.isArray(data)) {
                    setExpenses(data);
                } else if (data.expenses) {
                    setExpenses(data.expenses);
                } else {
                    setExpenses([]);
                }

            }

        } catch (error) {

            console.log(
                "Failed to load expenses:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        getTrip();
        getExpenses();

    }, [id]);


    // Add expense
    const handleAddExpense = async (e) => {

        e.preventDefault();

        setMessage("");
        setAddingExpense(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/expenses/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tripId: id,
                        title: title,
                        amount: Number(amount),
                        paidBy: user?._id,
                        splitType: splitType
                    })
                }
            );

            const data = await response.json();

            console.log(
                "Add expense response:",
                data
            );

            if (response.ok) {

                setTitle("");
                setAmount("");
                setSplitType("equal");

                setShowForm(false);

                setMessage(
                    "Expense added successfully!"
                );

                await getExpenses();
                await getTrip();

            } else {

                setMessage(
                    data.message ||
                    "Failed to add expense."
                );

            }

        } catch (error) {

            console.log(
                "Failed to add expense:",
                error
            );

            setMessage(
                "Unable to connect to the server."
            );

        } finally {

            setAddingExpense(false);

        }
    };


    // Calculate total expenses
    const totalExpenses = expenses.reduce(
        (total, expense) =>
            total + Number(expense.amount || 0),
        0
    );


    const formatDate = (date) => {

        if (!date) {
            return "";
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


    if (loading) {

        return (
            <div className="trip-details-page">

                <div className="trip-details-content">

                    <h2>
                        Loading expenses...
                    </h2>

                </div>

            </div>
        );

    }


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
                        navigate(`/trip/${id}`)
                    }
                >
                    ← Trip Details
                </button>

            </nav>


            <main className="trip-details-content">

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

                <section className="trip-details-hero">

                    <div>

                        <span>
                            SHARED EXPENSES
                        </span>

                        <h1>
                            {trip?.tripName || "Trip"}
                        </h1>

                        <p>
                            📍 {trip?.destination}
                        </p>

                    </div>


                    <div className="trip-code">

                        <small>
                            TOTAL SPENT
                        </small>

                        <strong>
                            ₹
                            {totalExpenses.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>

                </section>


                {/* EXPENSE SUMMARY */}

                <section className="trip-details-info">

                    <div className="trip-info-box">

                        <span>
                            💰 TOTAL EXPENSES
                        </span>

                        <strong>
                            ₹
                            {totalExpenses.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                        <p>
                            {expenses.length}{" "}
                            expenses
                        </p>

                    </div>


                    <div className="trip-info-box">

                        <span>
                            💳 TRIP BUDGET
                        </span>

                        <strong>
                            ₹
                            {Number(
                                trip?.totalBudget || 0
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                        <p>
                            Current trip budget
                        </p>

                    </div>


                    <div className="trip-info-box">

                        <span>
                            💵 REMAINING
                        </span>

                        <strong>
                            ₹
                            {Math.max(
                                0,
                                Number(
                                    trip?.totalBudget || 0
                                ) - totalExpenses
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                        <p>
                            Available budget
                        </p>

                    </div>

                </section>


                {/* EXPENSE SECTION */}

                <section className="expense-section">

                    <div className="trip-section-heading">

                        <div>

                            <span>
                                EXPENSES
                            </span>

                            <h2>
                                Group Spending
                            </h2>

                        </div>


                        <button
                            className="add-timeline-btn"
                            onClick={() =>
                                setShowForm(
                                    !showForm
                                )
                            }
                        >
                            {showForm
                                ? "✕ Cancel"
                                : "+ Add Expense"}
                        </button>

                    </div>


                    {/* MESSAGE */}

                    {message && (

                        <div className="timeline-message">
                            {message}
                        </div>

                    )}


                    {/* ADD EXPENSE FORM */}

                    {showForm && (

                        <form
                            className="timeline-form"
                            onSubmit={
                                handleAddExpense
                            }
                        >

                            <h3>
                                Add Shared Expense
                            </h3>


                            <label>
                                Expense Title
                            </label>

                            <input
                                type="text"
                                placeholder="Example: Hotel Booking"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            <label>
                                Amount
                            </label>

                            <input
                                type="number"
                                placeholder="Enter amount"
                                min="1"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            <label>
                                Split Type
                            </label>

                            <select
                                value={splitType}
                                onChange={(e) =>
                                    setSplitType(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="equal">
                                    Equal Split
                                </option>

              

                            </select>


                            <button
                                type="submit"
                                className="save-timeline-btn"
                                disabled={
                                    addingExpense
                                }
                            >
                                {addingExpense
                                    ? "Adding..."
                                    : "Add Expense"}
                            </button>

                        </form>

                    )}


                    {/* EXPENSE LIST */}

                    {expenses.length > 0 ? (

                        <div className="expense-list">

                            {expenses.map(
                                (expense) => (

                                    <div
                                        className="expense-card"
                                        key={expense._id}
                                    >

                                        <div className="expense-icon">
                                            💰
                                        </div>


                                        <div className="expense-main">

                                            <h3>
                                                {expense.title}
                                            </h3>

                                            <p>
                                                Paid by{" "}
                                                {expense.paidBy?.name ||
                                                    "Crew Member"}
                                            </p>

                                            <small>
                                                {formatDate(
                                                    expense.createdAt
                                                )}
                                            </small>

                                        </div>


                                        <div className="expense-amount">

                                            <strong>
                                                ₹
                                                {Number(
                                                    expense.amount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                            <span>
                                                {expense.splitType ===
                                                "equal"
                                                    ? "Equal split"
                                                    : expense.splitType ===
                                                      "percentage"
                                                    ? "Percentage split"
                                                    : "Custom split"}
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="empty-timeline">

                            <span>
                                💰
                            </span>

                            <h3>
                                No expenses yet
                            </h3>

                            <p>
                                Add your first shared
                                expense for this trip.
                            </p>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Expenses;