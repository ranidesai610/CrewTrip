
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function GroupChat() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);


    const user = JSON.parse(
        localStorage.getItem("user")
    );


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

            console.log("Failed to load trip:", error);

        }
    };


    // Get messages
    const getMessages = async () => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/messages/trip/${id}`
            );

            const data = await response.json();

            console.log("Messages:", data);

            if (response.ok) {

                setMessages(
                    Array.isArray(data.messages)
                        ? data.messages
                        : []
                );

            }

        } catch (error) {

            console.log("Failed to load messages:", error);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        getTrip();
        getMessages();

    }, [id]);


    // Send message
    const handleSendMessage = async () => {

        console.log("SEND BUTTON CLICKED");

        if (!message.trim()) {

            console.log("Message is empty");

            return;
        }


        if (!user?._id) {

            console.log("User is not logged in");

            return;
        }


        setSending(true);


        try {

            console.log("Sending message...");


            const response = await fetch(
                "http://localhost:5000/api/messages/send",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        tripId: id,
                        userId: user._id,
                        message: message.trim()
                    })
                }
            );


            const data = await response.json();


            console.log("Send response:", data);


            if (response.ok) {

                setMessage("");

                await getMessages();

            } else {

                console.log(
                    "Failed to send:",
                    data.message
                );

            }

        } catch (error) {

            console.log(
                "Send error:",
                error
            );

        } finally {

            setSending(false);

        }

    };


    // Delete message
    const handleDeleteMessage = async (messageId) => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/messages/${messageId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            console.log("Delete response:", data);


            if (response.ok) {

                await getMessages();

            }

        } catch (error) {

            console.log(
                "Delete error:",
                error
            );

        }

    };


    if (loading) {

        return (

            <div className="trip-details-page">

                <div className="trip-details-content">

                    <h2>
                        Loading group chat...
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
                            GROUP CHAT
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
                            MESSAGES
                        </small>


                        <strong>
                            {messages.length}
                        </strong>

                    </div>

                </section>


                {/* CHAT */}

                <section className="chat-section">


                    <div className="chat-header">

                        <h2>
                            💬 Chat with your crew
                        </h2>


                        <p>
                            Plan your trip together.
                        </p>

                    </div>


                    {/* MESSAGES */}

                    <div className="chat-messages">

                        {messages.length > 0 ? (

                            messages.map(
                                (chatMessage) => {

                                    const isMine =
                                        chatMessage.userId ===
                                        user?._id;


                                    return (

                                        <div
                                            className={`chat-message ${
                                                isMine
                                                    ? "my-message"
                                                    : "other-message"
                                            }`}
                                            key={
                                                chatMessage._id
                                            }
                                        >

                                            <div className="chat-message-content">

                                                <div className="chat-message-name">

                                                    {isMine
                                                        ? "You"
                                                        : "Crew Member"}

                                                </div>


                                                <p>
                                                    {
                                                        chatMessage.message
                                                    }
                                                </p>

                                            </div>


                                            {isMine && (

                                                <button
                                                    className="delete-chat-btn"
                                                    onClick={() =>
                                                        handleDeleteMessage(
                                                            chatMessage._id
                                                        )
                                                    }
                                                >
                                                    🗑️
                                                </button>

                                            )}

                                        </div>

                                    );

                                }
                            )

                        ) : (

                            <div className="empty-chat">

                                <span>
                                    💬
                                </span>


                                <h3>
                                    No messages yet
                                </h3>


                                <p>
                                    Start the conversation
                                    with your crew.
                                </p>

                            </div>

                        )}

                    </div>


                    {/* SEND MESSAGE */}

                    <div className="chat-input-area">

                        <input
                            type="text"
                            placeholder="Write a message..."
                            value={message}
                            onChange={(e) =>
                                setMessage(
                                    e.target.value
                                )
                            }

                            onKeyDown={(e) => {

                                if (e.key === "Enter") {

                                    handleSendMessage();

                                }

                            }}
                        />


                        <button
                            type="button"
                            onClick={handleSendMessage}
                            disabled={sending}
                        >

                            {sending
                                ? "..."
                                : "Send"}

                        </button>

                    </div>


                </section>


            </main>

        </div>

    );
}



export default GroupChat;

