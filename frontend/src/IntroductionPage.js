import React from "react";
import "./IntroductionPage.css";

function IntroductionPage() {

    const handleShare = async () => {
        const shareData = {
            title: "SmartExam",
            text: "Prepare better. Practise smarter. Face your exam with confidence.",
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href);
                alert("SmartExam link copied. You can now share it with your friends and colleagues.");
            } else {
                alert("Please copy the SmartExam website address from your browser and share it with your friends and colleagues.");
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Share failed:", error);
            }
        }
    };

    const goToRegister = () => {
        window.location.href = "/register";
    };

    const goToLogin = () => {
        window.location.href = "/login";
    };

    const startPractising = () => {
        window.location.href = "/register";
    };

    return (
        <div className="introduction-page">

            {/* =========================
                NAVIGATION
            ========================== */}
            <header className="intro-header">
                <div className="intro-nav-container">

                    <div
                        className="intro-logo"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        SMART<span>EXAM</span>
                    </div>

                    <nav className="intro-navigation">

                        <button
                            type="button"
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                        >
                            Home
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById("why-smart-exam")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            Why SmartExam
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById("how-it-works")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            How It Works
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById("share-smart-exam")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            Share SmartExam
                        </button>

                        <button
                            type="button"
                            className="nav-login"
                            onClick={goToLogin}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className="nav-register"
                            onClick={goToRegister}
                        >
                            Register
                        </button>

                    </nav>
                </div>
            </header>


            {/* =========================
                HERO SECTION
            ========================== */}
            <main>

                <section className="intro-hero">

                    <div className="hero-content">

                        <div className="hero-label">
                            YOUR DIGITAL CBT PREPARATION PLATFORM
                        </div>

                        <h1>
                            SMART <span>EXAM</span>
                        </h1>

                        <h2>
                            Prepare Better. Practise Smarter.
                            <br />
                            Face Your Exam With Confidence.
                        </h2>

                        <p>
                            Welcome to <strong>SmartExam</strong> — a modern
                            computer-based examination preparation platform
                            designed to help candidates practise, test their
                            knowledge, understand their performance, and become
                            more familiar with the CBT examination experience.
                        </p>

                        <p>
                            Whether you are preparing for an important
                            examination, revising with classmates, or simply
                            testing how much you know, SmartExam gives you a
                            convenient place to practise and improve.
                        </p>

                        <div className="hero-message">
                            Your preparation starts here.
                        </div>

                        <div className="hero-buttons">

                            <button
                                type="button"
                                className="primary-button"
                                onClick={startPractising}
                            >
                                START PRACTISING
                            </button>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={goToRegister}
                            >
                                REGISTER
                            </button>

                            <button
                                type="button"
                                className="text-button"
                                onClick={goToLogin}
                            >
                                LOGIN
                            </button>

                        </div>

                    </div>

                </section>


                {/* =========================
                    WHY SMART EXAM
                ========================== */}
                <section
                    id="why-smart-exam"
                    className="intro-section"
                >

                    <div className="section-heading">

                        <div className="section-label">
                            WHY SMARTEXAM?
                        </div>

                        <h2>
                            Prepare More Than Just By Reading
                        </h2>

                        <p>
                            Preparing for an examination is not only about
                            reading. It is also about <strong>practising,
                            testing yourself, identifying weaknesses, and
                            improving consistently.</strong>
                        </p>

                        <p>
                            SmartExam brings these important parts of
                            preparation together in one simple digital
                            environment.
                        </p>

                    </div>


                    <div className="feature-grid">

                        <article className="feature-card">
                            <div className="feature-number">01</div>
                            <div className="feature-icon">📝</div>

                            <h3>Practise With CBT Questions</h3>

                            <p>
                                Get familiar with answering questions in a
                                computer-based examination environment.
                            </p>

                            <p>
                                Instead of waiting until examination day to
                                experience CBT, use SmartExam to practise
                                beforehand.
                            </p>
                        </article>


                        <article className="feature-card">
                            <div className="feature-number">02</div>
                            <div className="feature-icon">⏱️</div>

                            <h3>Experience Timed Practice</h3>

                            <p>
                                Time management matters during examinations.
                            </p>

                            <p>
                                SmartExam provides timed practice and
                                examination experiences that can help you
                                become more comfortable working within a
                                limited time.
                            </p>
                        </article>


                        <article className="feature-card">
                            <div className="feature-number">03</div>
                            <div className="feature-icon">🎯</div>

                            <h3>Test Your Knowledge</h3>

                            <p>
                                Don't just read — <strong>test yourself.</strong>
                            </p>

                            <p>
                                Answer questions, challenge your understanding,
                                and discover the areas where you may need
                                additional preparation.
                            </p>
                        </article>


                        <article className="feature-card">
                            <div className="feature-number">04</div>
                            <div className="feature-icon">📊</div>

                            <h3>Understand Your Performance</h3>

                            <p>
                                After completing a practice session or
                                examination, review your result and use it as
                                a guide for further preparation.
                            </p>

                            <p>
                                Your result is not the end of the process.
                            </p>

                            <strong>
                                It is information that can help you prepare
                                better.
                            </strong>
                        </article>


                        <article className="feature-card">
                            <div className="feature-number">05</div>
                            <div className="feature-icon">🔄</div>

                            <h3>Practise Again and Improve</h3>

                            <p>
                                One attempt is rarely enough.
                            </p>

                            <p>
                                Return to SmartExam, practise again, work on
                                areas that need attention, and continue
                                building your confidence.
                            </p>
                        </article>

                    </div>

                </section>


                {/* =========================
                    BUILT AROUND CANDIDATE
                ========================== */}
                <section
                    id="how-it-works"
                    className="intro-section intro-section-soft"
                >

                    <div className="section-heading">

                        <div className="section-label">
                            BUILT AROUND THE CANDIDATE
                        </div>

                        <h2>
                            A Simple Preparation Journey
                        </h2>

                        <p>
                            We understand that candidates want a preparation
                            platform that is:
                        </p>

                        <div className="simple-values">
                            <span>Simple.</span>
                            <span>Clear.</span>
                            <span>Accessible.</span>
                            <span>Useful.</span>
                        </div>

                        <p>
                            You should not have to struggle with a complicated
                            interface just to begin practising.
                        </p>

                    </div>


                    <div className="steps-grid">

                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Register</h3>
                            <p>Create your SmartExam account.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Choose Your Practice</h3>
                            <p>
                                Select the available practice or examination
                                option that matches your preparation needs.
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Start Practising</h3>
                            <p>
                                Answer questions in a CBT-style environment.
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">4</div>
                            <h3>Complete Your Attempt</h3>
                            <p>
                                Work through your questions and manage your
                                time.
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">5</div>
                            <h3>Review Your Performance</h3>
                            <p>
                                Use your result to understand how you
                                performed.
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">6</div>
                            <h3>Prepare Again</h3>
                            <p>
                                Identify areas that need more attention and
                                continue practising.
                            </p>
                        </div>

                    </div>

                </section>


                {/* =========================
                    MORE THAN QUESTIONS
                ========================== */}
                <section className="intro-section">

                    <div className="two-column-section">

                        <div className="section-heading align-left">

                            <div className="section-label">
                                MORE THAN JUST QUESTIONS
                            </div>

                            <h2>
                                Become Familiar With the CBT Experience
                            </h2>

                            <p>
                                A good preparation platform should help you
                                become comfortable with the
                                <strong>
                                    {" "}process of taking a computer-based
                                    examination.
                                </strong>
                            </p>

                            <p>
                                With SmartExam, candidates can become familiar
                                with important CBT habits before examination
                                day.
                            </p>

                        </div>


                        <div className="check-list">

                            <div className="check-item">
                                <span>✓</span>
                                <p>Reading questions carefully on screen</p>
                            </div>

                            <div className="check-item">
                                <span>✓</span>
                                <p>Selecting answers digitally</p>
                            </div>

                            <div className="check-item">
                                <span>✓</span>
                                <p>Moving through questions efficiently</p>
                            </div>

                            <div className="check-item">
                                <span>✓</span>
                                <p>Managing examination time</p>
                            </div>

                            <div className="check-item">
                                <span>✓</span>
                                <p>Reviewing answers</p>
                            </div>

                            <div className="check-item">
                                <span>✓</span>
                                <p>Completing an examination session</p>
                            </div>

                            <div className="check-item">
                                <span>✓</span>
                                <p>Understanding performance after an attempt</p>
                            </div>

                        </div>

                    </div>


                    <div className="highlight-message">
                        The more familiar you become with the process, the less
                        unfamiliar the CBT environment may feel when it matters.
                    </div>

                </section>


                {/* =========================
                    PREPARE AT YOUR OWN PACE
                ========================== */}
                <section className="intro-section intro-section-soft">

                    <div className="center-content">

                        <div className="section-label">
                            PREPARE AT YOUR OWN PACE
                        </div>

                        <h2>
                            Your Preparation Journey Is Your Own
                        </h2>

                        <p>
                            Some candidates may want frequent practice.
                            Others may want to test themselves occasionally.
                        </p>

                        <p>
                            SmartExam provides a digital environment where you
                            can return to your preparation and continue
                            practising.
                        </p>

                        <div className="large-message">
                            Practise today.
                            <br />
                            Learn from your result.
                            <br />
                            Come back stronger.
                        </div>

                    </div>

                </section>


                {/* =========================
                    PERFORMANCE
                ========================== */}
                <section className="intro-section">

                    <div className="performance-section">

                        <div className="performance-content">

                            <div className="section-label">
                                YOUR RESULT CAN GUIDE YOUR PREPARATION
                            </div>

                            <h2>
                                Your Practice Score Is More Than a Number
                            </h2>

                            <p>
                                A practice score should not simply be a number.
                            </p>

                            <p>
                                It can help you ask better questions:
                            </p>

                        </div>


                        <div className="question-grid">

                            <div className="question-card">
                                Which areas do I understand well?
                            </div>

                            <div className="question-card">
                                Where am I making mistakes?
                            </div>

                            <div className="question-card">
                                What should I revise again?
                            </div>

                            <div className="question-card">
                                Am I improving with practice?
                            </div>

                        </div>

                        <div className="performance-footer">
                            Use every attempt as an opportunity to learn more
                            about your preparation.
                        </div>

                    </div>

                </section>


                {/* =========================
                    SHARE SMARTEXAM
                ========================== */}
                <section
                    id="share-smart-exam"
                    className="intro-section share-section"
                >

                    <div className="share-content">

                        <div className="section-label">
                            PREPARING WITH OTHERS?
                        </div>

                        <h2>
                            Share SmartExam With Your Colleagues and Friends
                        </h2>

                        <p>
                            Examination preparation does not have to be a
                            journey you take alone.
                        </p>

                        <p>
                            If you know classmates, colleagues, friends,
                            study groups, or other candidates preparing for
                            examinations, introduce them to SmartExam.
                        </p>

                        <div className="share-highlight">
                            One candidate can introduce another.
                        </div>

                        <p>
                            Share SmartExam with someone who may benefit from
                            having a convenient place to practise CBT questions
                            and test their preparation.
                        </p>

                        <button
                            type="button"
                            className="primary-button share-button"
                            onClick={handleShare}
                        >
                            SHARE SMARTEXAM
                        </button>

                        <div className="share-message">

                            <strong>
                                Prepare Together. Encourage One Another.
                                Keep Improving.
                            </strong>

                            <p>
                                Your colleague may be preparing for the same
                                examination.
                            </p>

                            <p>
                                Your friend may be looking for CBT practice.
                            </p>

                            <p>
                                Someone in your study group may need another
                                way to test their knowledge.
                            </p>

                            <strong>
                                Tell them about SmartExam.
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =========================
                    WHY CANDIDATES CHOOSE
                ========================== */}
                <section className="intro-section intro-section-soft">

                    <div className="section-heading">

                        <div className="section-label">
                            SMARTEXAM FEATURES
                        </div>

                        <h2>
                            Why Candidates May Choose SmartExam
                        </h2>

                    </div>


                    <div className="feature-grid six-features">

                        <article className="feature-card">
                            <div className="feature-icon">💻</div>
                            <h3>CBT Familiarity</h3>
                            <p>
                                Become more comfortable answering questions
                                digitally.
                            </p>
                        </article>

                        <article className="feature-card">
                            <div className="feature-icon">🧠</div>
                            <h3>Active Practice</h3>
                            <p>
                                Test your knowledge instead of relying only
                                on passive reading.
                            </p>
                        </article>

                        <article className="feature-card">
                            <div className="feature-icon">⏰</div>
                            <h3>Time Awareness</h3>
                            <p>
                                Practise working with examination time limits.
                            </p>
                        </article>

                        <article className="feature-card">
                            <div className="feature-icon">📈</div>
                            <h3>Performance Feedback</h3>
                            <p>
                                Use your results to guide your preparation.
                            </p>
                        </article>

                        <article className="feature-card">
                            <div className="feature-icon">🔁</div>
                            <h3>Repeat Preparation</h3>
                            <p>
                                Return and continue practising.
                            </p>
                        </article>

                        <article className="feature-card">
                            <div className="feature-icon">👥</div>
                            <h3>Easy to Share</h3>
                            <p>
                                Introduce SmartExam to friends, colleagues
                                and study groups.
                            </p>
                        </article>

                    </div>

                </section>


                {/* =========================
                    FINAL CTA
                ========================== */}
                <section className="final-cta">

                    <div className="final-cta-content">

                        <div className="section-label">
                            YOUR EXAMINATION PREPARATION STARTS BEFORE
                            EXAMINATION DAY
                        </div>

                        <h2>
                            Don't Wait Until Examination Day
                        </h2>

                        <p>
                            Walking into a CBT examination for the first time
                            without having practised the process can make the
                            experience feel unfamiliar.
                        </p>

                        <p>
                            Preparation can make a difference.
                        </p>

                        <p>
                            Give yourself an opportunity to practise the
                            environment, test your knowledge, manage your
                            time, and learn from your attempts.
                        </p>

                        <div className="final-message">
                            Start practising today.
                        </div>

                        <button
                            type="button"
                            className="primary-button large-button"
                            onClick={goToRegister}
                        >
                            REGISTER NOW
                        </button>

                        <button
                            type="button"
                            className="final-login-button"
                            onClick={goToLogin}
                        >
                            Already have an account? LOGIN
                        </button>

                    </div>

                </section>


                {/* =========================
                    SMARTEXAM MESSAGE
                ========================== */}
                <section className="intro-section message-section">

                    <div className="message-content">

                        <div className="section-label">
                            A MESSAGE FROM SMARTEXAM
                        </div>

                        <h2>
                            Every Candidate Has a Different Preparation Journey
                        </h2>

                        <p>
                            Some begin early.
                            <br />
                            Some begin late.
                            <br />
                            Some need more practice.
                            <br />
                            Some need more confidence.
                        </p>

                        <p>
                            Wherever you are in your preparation, the important
                            thing is to
                            <strong>
                                {" "}keep learning, keep practising, and keep
                                improving.
                            </strong>
                        </p>

                        <p>
                            SmartExam is here to support that journey.
                        </p>

                        <div className="welcome-message">
                            Welcome to SmartExam.
                        </div>

                        <div className="closing-tagline">
                            Prepare Better. Practise Smarter.
                        </div>

                    </div>

                </section>

            </main>


            {/* =========================
                FOOTER
            ========================== */}
            <footer className="intro-footer">

                <div className="footer-container">

                    <div className="footer-brand">

                        <div className="intro-logo footer-logo">
                            SMART<span>EXAM</span>
                        </div>

                        <p>
                            Prepare. Practise. Improve.
                        </p>

                        <p>
                            A simple digital platform for candidates who want
                            to take their CBT preparation seriously.
                        </p>

                    </div>


                    <div className="footer-links">

                        <div>
                            <h3>SmartExam</h3>

                            <button
                                type="button"
                                onClick={() =>
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth"
                                    })
                                }
                            >
                                Home
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById("why-smart-exam")
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        })
                                }
                            >
                                Why SmartExam
                            </button>

                            <button
                                type="button"
                                onClick={goToRegister}
                            >
                                Register
                            </button>

                            <button
                                type="button"
                                onClick={goToLogin}
                            >
                                Login
                            </button>
                        </div>


                        <div>
                            <h3>Connect</h3>

                            <button
                                type="button"
                                onClick={handleShare}
                            >
                                Share SmartExam
                            </button>

                            <button
                                type="button"
                                onClick={goToRegister}
                            >
                                Get Started
                            </button>
                        </div>

                    </div>

                </div>


                <div className="footer-bottom">

                    <p>
                        © {new Date().getFullYear()} SmartExam. All rights
                        reserved.
                    </p>

                    <p>
                        Your preparation. Your practice. Your progress.
                    </p>

                </div>

            </footer>

        </div>
    );
}

export default IntroductionPage;