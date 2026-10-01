import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate
} from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import TripDetails from "./TripDetails";
import CreateTrip from "./CreateTrip";
import Expenses from "./Expenses";
import PackingList from "./PackingList";
import GroupChat from "./GroupChat";
import Voting from "./Voting";
import TravelJournal from "./TravelJournal";
import Profile from "./Profile";
import Availability from "./Availability";
import Register from "./Register";
import Tasks from "./Tasks";
import "./App.css";


function Home() {

    const navigate = useNavigate();

    return (
        <div className="home-page">

            {/* ================================
                NAVBAR
            ================================= */}

            <nav className="home-navbar">

                <div
                    className="home-logo"
                    onClick={() => navigate("/")}
                >
                    ✈️ CrewTrip
                </div>


                <div className="home-nav-links">

                    <a href="#trip">
                        Trips
                    </a>

                    <a href="#features">
                        Plan Together
                    </a>

                    <a href="#features">
                        Memories
                    </a>

                    <a href="#features">
                        Features
                    </a>

                </div>


                <div className="home-nav-actions">

                    <button
                        className="home-login-btn"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>


                    <button
                        className="home-start-btn"
                        onClick={() =>
                            navigate("/create-trip")
                        }
                    >
                        Get Started
                    </button>

                </div>

            </nav>


            {/* ================================
                HERO
            ================================= */}

            <section className="home-hero">

                <div>

                    <div className="hero-label">
                        ✨ MADE FOR TRAVEL CREWS
                    </div>


                    <h1>
                        Plan it.
                        <br />

                        <span>
                            Share it.
                        </span>

                        <br />

                        Travel together.
                    </h1>


                    <p className="home-hero-description">
                        CrewTrip brings your entire group
                        trip into one place — from planning
                        and expenses to memories.
                    </p>


                    <div className="hero-buttons">

                        <button
                            className="hero-primary-btn"
                            onClick={() =>
                                navigate("/create-trip")
                            }
                        >
                            ✈️ Create a Trip
                        </button>


                        <button
                            className="hero-secondary-btn"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            🔗 Join Your Crew
                        </button>

                    </div>

                </div>


                {/* ================================
                    CREW PREVIEW
                ================================= */}

                <div className="hero-visual">

                    <div className="crew-preview-card">

                        <div className="crew-preview-top">

                            <span>
                                YOUR TRAVEL CREW
                            </span>

                            <strong>
                                4 MEMBERS
                            </strong>

                        </div>


                        <div className="crew-destination">

                            <small>
                                NEXT ADVENTURE
                            </small>

                            <h2>
                                Mumbai
                            </h2>

                            <p>
                                10 Nov — 13 Nov 2026
                            </p>

                        </div>


                        <div className="crew-members">

                            <div className="member-avatars">

                                <div className="member-avatar">
                                    R
                                </div>

                                <div className="member-avatar">
                                    R
                                </div>

                                <div className="member-avatar">
                                    A
                                </div>

                                <div className="member-avatar">
                                    S
                                </div>

                            </div>


                            <span>
                                4 friends planning together
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================================
                TRIP PREVIEW
            ================================= */}

            <section
                className="home-trip-section"
                id="trip"
            >

                <div className="home-trip-card">

                    <div className="home-trip-main">

                        <span className="home-trip-label">
                            OUR NEXT ADVENTURE
                        </span>


                        <h2>
                            Mumbai Adventure
                        </h2>


                        <p>
                            📍 Mumbai &nbsp; • &nbsp;
                            📅 10 Nov — 13 Nov 2026
                        </p>

                    </div>


                    <div className="home-trip-stats">

                        <div className="home-trip-stat">

                            <small>
                                CREW
                            </small>

                            <strong>
                                4 Members
                            </strong>

                        </div>


                        <div className="home-trip-stat">

                            <small>
                                TRIP BUDGET
                            </small>

                            <strong>
                                ₹50,000
                            </strong>

                        </div>


                        <div className="home-trip-stat">

                            <small>
                                SPENT
                            </small>

                            <strong>
                                ₹5,000
                            </strong>

                        </div>


                        <div className="home-trip-stat">

                            <small>
                                STATUS
                            </small>

                            <strong>
                                Planning
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================================
                FEATURES
            ================================= */}

            <section
                className="home-features"
                id="features"
            >

                <div className="home-section-heading">

                    <span>
                        EVERYTHING YOUR CREW NEEDS
                    </span>


                    <h2>
                        One trip.
                        <br />

                        Everything organized.
                    </h2>


                    <p>
                        No more spreadsheets, scattered
                        chats or forgotten tasks.
                    </p>

                </div>


                <div className="home-feature-grid">


                    {/* EXPENSES */}

                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            💰
                        </div>

                        <h3>
                            Shared Expenses
                        </h3>

                        <p>
                            Track who paid, split expenses
                            and keep your group budget clear.
                        </p>

                    </div>


                    {/* ITINERARY */}

                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            🗓️
                        </div>

                        <h3>
                            Trip Itinerary
                        </h3>

                        <p>
                            Plan activities, dates and
                            important moments together.
                        </p>

                    </div>


                    {/* PACKING */}

                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            🎒
                        </div>

                        <h3>
                            Packing List
                        </h3>

                        <p>
                            Create a shared checklist so
                            nobody forgets the essentials.
                        </p>

                    </div>


                    {/* CHAT */}

                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            💬
                        </div>

                        <h3>
                            Group Chat
                        </h3>

                        <p>
                            Keep all your trip conversations
                            together with your crew.
                        </p>

                    </div>


                    {/* VOTING */}

                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            🗳️
                        </div>

                        <h3>
                            Group Voting
                        </h3>

                        <p>
                            Let everyone vote on destinations,
                            activities and plans.
                        </p>

                    </div>


                    {/* MEMORIES */}

                    <div className="home-feature-card">

                        <div className="home-feature-icon">
                            📸
                        </div>

                        <h3>
                            Travel Memories
                        </h3>

                        <p>
                            Save your stories and memories
                            from every adventure.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================================
                BOTTOM CTA
            ================================= */}

            <section className="home-cta">

                <div className="home-cta-box">

                    <h2>
                        Your trip. Your crew.
                    </h2>

                    <p>
                        Plan the adventure together.
                    </p>


                    <button
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Start Planning ✈️
                    </button>

                </div>

            </section>


            {/* ================================
                FOOTER
            ================================= */}

            <footer className="home-footer">

                <strong>
                    ✈️ CrewTrip
                </strong>

                <span>
                    Plan together. Travel together.
                </span>

                <span>
                    © 2026 CrewTrip
                </span>

            </footer>

        </div>
    );
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/trip/:id"
                    element={<TripDetails />}
                />
               <Route
    path="/create-trip"
    element={<CreateTrip />}
/> 
<Route
    path="/trip/:id/expenses"
    element={<Expenses />}
/>


<Route
    path="/trip/:id/packing"
    element={<PackingList />}
/>

<Route
    path="/trip/:id/chat"
    element={<GroupChat />}
/>

<Route
    path="/trip/:id/voting"
    element={<Voting />}
/>
<Route
    path="/trip/:id/journal"
    element={<TravelJournal />}
/>

<Route
    path="/profile"
    element={<Profile />}
/>
<Route
    path="/trip/:id/Availability"
    element={<Availability />}
/>

<Route
    path="/register"
    element={<Register />}
/>
<Route
    path="/trip/:id/tasks"
    element={<Tasks />}
/>


            </Routes>


        </BrowserRouter>

    );
}


export default App;