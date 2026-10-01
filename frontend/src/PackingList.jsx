import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PackingList() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [item, setItem] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    const [message, setMessage] = useState("");
    const [addingItem, setAddingItem] = useState(false);


    // Get trip
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

// Get packing items
 const getItems = async () => {

    try {

        const response = await fetch(
            `http://localhost:5000/api/packing/trip/${id}`
        );

        const data = await response.json();

        console.log("Packing items:", data);

        if (response.ok) {

            if (Array.isArray(data.packingItems)) {

                setItems(data.packingItems);

            } else {

                setItems([]);

            }

        }

    } catch (error) {

        console.log(
            "Failed to load packing items:",
            error
        );

    } finally {

        setLoading(false);

    }
};
    


    useEffect(() => {

        getTrip();
        getItems();

    }, [id]);


    // Add packing item
    const handleAddItem = async (e) => {

        e.preventDefault();

        setMessage("");
        setAddingItem(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/packing/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tripId: id,
                        item: item,
                        assignedTo: assignedTo || null
                    })
                }
            );

            const data = await response.json();

            console.log(
                "Add packing item:",
                data
            );

            if (response.ok) {

                setItem("");
                setAssignedTo("");

                setShowForm(false);

                setMessage(
                    "Packing item added successfully!"
                );

                await getItems();

            } else {

                setMessage(
                    data.message ||
                    "Failed to add packing item."
                );

            }

        } catch (error) {

            console.log(
                "Failed to add packing item:",
                error
            );

            setMessage(
                "Unable to connect to the server."
            );

        } finally {

            setAddingItem(false);

        }
    };


    // Mark item as packed
    const handleTogglePacked = async (packingItem) => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/packing/${packingItem._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        packed: !packingItem.packed
                    })
                }
            );

            const data = await response.json();

            console.log(
                "Update packing item:",
                data
            );

            if (response.ok) {

                await getItems();

            } else {

                setMessage(
                    data.message ||
                    "Failed to update item."
                );

            }

        } catch (error) {

            console.log(
                "Failed to update packing item:",
                error
            );

        }
    };


    // Delete item
    const handleDeleteItem = async (itemId) => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/packing/${itemId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            console.log(
                "Delete packing item:",
                data
            );

            if (response.ok) {

                await getItems();

                setMessage(
                    "Packing item deleted."
                );

            } else {

                setMessage(
                    data.message ||
                    "Failed to delete item."
                );

            }

        } catch (error) {

            console.log(
                "Failed to delete packing item:",
                error
            );

        }
    };


    // Find assigned member dynamically
    const getAssignedMember = (assignedUser) => {

        if (!assignedUser) {
            return null;
        }

        // If backend returns populated user object
        if (
            typeof assignedUser === "object" &&
            assignedUser.name
        ) {
            return assignedUser;
        }

        // If backend returns only ObjectId
        return trip?.members?.find(
            (member) =>
                member._id === assignedUser
        );
    };


    const packedCount = items.filter(
        (packingItem) =>
            packingItem.packed
    ).length;


    if (loading) {

        return (
            <div className="trip-details-page">

                <div className="trip-details-content">

                    <h2>
                        Loading packing list...
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
                            PACKING
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
                            PACKED
                        </small>

                        <strong>
                            {packedCount}/{items.length}
                        </strong>

                    </div>

                </section>


                {/* PACKING SECTION */}

                <section className="expense-section">

                    <div className="trip-section-heading">

                        <div>

                            <span>
                                PACKING LIST
                            </span>

                            <h2>
                                Get ready for the trip
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
                                : "+ Add Item"}
                        </button>

                    </div>


                    {/* MESSAGE */}

                    {message && (

                        <div className="timeline-message">
                            {message}
                        </div>

                    )}


                    {/* ADD ITEM FORM */}

                    {showForm && (

                        <form
                            className="timeline-form"
                            onSubmit={
                                handleAddItem
                            }
                        >

                            <h3>
                                Add Packing Item
                            </h3>


                            <label>
                                Item
                            </label>

                            <input
                                type="text"
                                placeholder="Example: Toothbrush"
                                value={item}
                                onChange={(e) =>
                                    setItem(
                                        e.target.value
                                    )
                                }
                                required
                            />


                            <label>
                                Assign To
                            </label>

                            <select
                                value={assignedTo}
                                onChange={(e) =>
                                    setAssignedTo(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Not assigned
                                </option>

                                {trip?.members?.map(
                                    (member) => (

                                        <option
                                            key={
                                                member._id
                                            }
                                            value={
                                                member._id
                                            }
                                        >
                                            {member.name}
                                        </option>

                                    )
                                )}

                            </select>


                            <button
                                type="submit"
                                className="save-timeline-btn"
                                disabled={
                                    addingItem
                                }
                            >
                                {addingItem
                                    ? "Adding..."
                                    : "Add Item"}
                            </button>

                        </form>

                    )}


                    {/* PACKING ITEMS */}

                    {items.length > 0 ? (

                        <div className="packing-list">

                            {items.map(
                                (packingItem) => {

                                    const assignedMember =
                                        getAssignedMember(
                                            packingItem.assignedTo
                                        );

                                    return (

                                        <div
                                            className={`packing-item ${
                                                packingItem.packed
                                                    ? "packed"
                                                    : ""
                                            }`}
                                            key={
                                                packingItem._id
                                            }
                                        >

                                            <button
                                                className="packing-check"
                                                onClick={() =>
                                                    handleTogglePacked(
                                                        packingItem
                                                    )
                                                }
                                            >
                                                {packingItem.packed
                                                    ? "✓"
                                                    : "☐"}
                                            </button>


                                            <div className="packing-item-main">

                                                <h3>
                                                    {packingItem.item}
                                                </h3>

                                                <p>
                                                    {assignedMember
                                                        ? `Assigned to ${assignedMember.name}`
                                                        : "Not assigned"}
                                                </p>

                                            </div>


                                            <button
                                                className="delete-packing-btn"
                                                onClick={() =>
                                                    handleDeleteItem(
                                                        packingItem._id
                                                    )
                                                }
                                            >
                                                🗑️
                                            </button>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    ) : (

                        <div className="empty-timeline">

                            <span>
                                🎒
                            </span>

                            <h3>
                                Your packing list is empty
                            </h3>

                            <p>
                                Add things that your crew
                                needs to bring.
                            </p>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default PackingList;