import React from "react";
import { useNavigate } from "react-router-dom";

function EnglishPlatformPage() {
    const navigate = useNavigate();

    /* ==========================================================
       NAVIGATION
    ========================================================== */

    const goToLogin = () => {
        navigate("/login");
    };

    const goToRegister = () => {
        navigate("/register");
    };

    const goToLocalExamination = () => {
        navigate("/english-countries");
    };

    const goToInternationalExamination = () => {
        /*
          International Examination route will be connected
          when the International Examination section is built.
        */
        alert(
            "The International Examination platform is being prepared."
        );
    };

    const goBackHome = () => {
        navigate("/");
    };


    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f7f9fc",
                color: "#172033",
                fontFamily:
                    "Arial, Helvetica, sans-serif"
            }}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <header
                style={{
                    background: "#ffffff",
                    borderBottom:
                        "1px solid #e5e9f0",
                    position: "sticky",
                    top: 0,
                    zIndex: 100
                }}
            >

                <div
                    style={{
                        maxWidth: "1180px",
                        margin: "0 auto",
                        padding: "18px 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "20px"
                    }}
                >

                    <button
                        type="button"
                        onClick={goBackHome}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            padding: 0,
                            fontSize: "25px",
                            fontWeight: "800",
                            letterSpacing: "0.5px"
                        }}
                    >
                        SMART
                        <span>
                            EXAM
                        </span>
                    </button>


                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >

                        <span
                            style={{
                                fontSize: "25px"
                            }}
                        >
                            {"\u{1F1EC}\u{1F1E7}"}
                        </span>

                        <strong>
                            English CBT
                        </strong>

                    </div>


                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center"
                        }}
                    >

                        <button
                            type="button"
                            onClick={goToLogin}
                            style={{
                                background: "transparent",
                                border:
                                    "1px solid #cbd3df",
                                borderRadius: "7px",
                                padding:
                                    "10px 18px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Login
                        </button>


                        <button
                            type="button"
                            onClick={goToRegister}
                            style={{
                                background: "#172033",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "7px",
                                padding:
                                    "10px 18px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Register
                        </button>

                    </div>

                </div>

            </header>


            {/* ==================================================
                HERO
            ================================================== */}

            <main>

                <section
                    style={{
                        background:
                            "linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)",
                        padding:
                            "70px 24px 55px",
                        textAlign: "center"
                    }}
                >

                    <div
                        style={{
                            maxWidth: "900px",
                            margin: "0 auto"
                        }}
                    >

                        <div
                            style={{
                                display:
                                    "inline-flex",
                                alignItems:
                                    "center",
                                gap: "8px",
                                padding:
                                    "8px 14px",
                                borderRadius:
                                    "30px",
                                background:
                                    "#eef2f7",
                                fontSize: "14px",
                                fontWeight: "700",
                                marginBottom:
                                    "22px"
                            }}
                        >
                            {"\u{1F1EC}\u{1F1E7}"} ENGLISH EXAMINATION PLATFORM
                        </div>


                        <h1
                            style={{
                                margin:
                                    "0 0 18px",
                                fontSize:
                                    "clamp(36px, 6vw, 60px)",
                                lineHeight: "1.08",
                                fontWeight: "800"
                            }}
                        >
                            English CBT
                        </h1>


                        <h2
                            style={{
                                margin:
                                    "0 auto 20px",
                                maxWidth:
                                    "760px",
                                fontSize:
                                    "clamp(22px, 3vw, 34px)",
                                lineHeight:
                                    "1.25",
                                fontWeight:
                                    "700"
                            }}
                        >
                            Prepare, Practise and Take
                            Your Examination Digitally
                        </h2>


                        <p
                            style={{
                                maxWidth:
                                    "760px",
                                margin:
                                    "0 auto",
                                fontSize:
                                    "18px",
                                lineHeight:
                                    "1.7",
                                color:
                                    "#596579"
                            }}
                        >
                            Welcome to the SmartExam English
                            examination platform. Select the type
                            of examination you want to access and
                            continue through the appropriate
                            examination pathway.
                        </p>

                    </div>

                </section>


                {/* ==================================================
                    EXAMINATION CHOICES
                ================================================== */}

                <section
                    style={{
                        padding:
                            "20px 24px 75px"
                    }}
                >

                    <div
                        style={{
                            maxWidth:
                                "1080px",
                            margin:
                                "0 auto"
                        }}
                    >

                        <div
                            style={{
                                textAlign:
                                    "center",
                                marginBottom:
                                    "38px"
                            }}
                        >

                            <div
                                style={{
                                    fontSize:
                                        "13px",
                                    fontWeight:
                                        "800",
                                    letterSpacing:
                                        "1.5px",
                                    marginBottom:
                                        "10px"
                                }}
                            >
                                CHOOSE YOUR EXAMINATION
                            </div>


                            <h2
                                style={{
                                    margin:
                                        "0 0 12px",
                                    fontSize:
                                        "32px"
                                }}
                            >
                                What type of examination
                                are you taking?
                            </h2>


                            <p
                                style={{
                                    margin:
                                        "0 auto",
                                    maxWidth:
                                        "680px",
                                    color:
                                        "#667085",
                                    lineHeight:
                                        "1.6"
                                }}
                            >
                                SmartExam separates local and
                                international examinations so
                                candidates can follow the correct
                                examination pathway.
                            </p>

                        </div>


                        <div
                            style={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "24px"
                            }}
                        >

                            {/* ==================================================
                                LOCAL EXAMINATION
                            ================================================== */}

                            <article
                                style={{
                                    background:
                                        "#ffffff",
                                    border:
                                        "1px solid #e1e6ee",
                                    borderRadius:
                                        "14px",
                                    padding:
                                        "34px",
                                    boxShadow:
                                        "0 8px 25px rgba(20, 35, 60, 0.06)"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize:
                                            "42px",
                                        marginBottom:
                                            "18px"
                                    }}
                                >
                                    {"\u{1F3DB}"}
                                </div>


                                <h3
                                    style={{
                                        margin:
                                            "0 0 14px",
                                        fontSize:
                                            "27px"
                                    }}
                                >
                                    Local Examination
                                </h3>


                                <p
                                    style={{
                                        color:
                                            "#596579",
                                        lineHeight:
                                            "1.7",
                                        margin:
                                            "0 0 22px"
                                    }}
                                >
                                    Access examinations organised
                                    for specific countries and
                                    examination programmes.
                                </p>


                                <div
                                    style={{
                                        marginBottom:
                                            "25px"
                                    }}
                                >

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap: "10px",
                                            marginBottom:
                                                "12px"
                                        }}
                                    >
                                        <span>✓</span>

                                        <span>
                                            Select your country
                                        </span>
                                    </div>


                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap: "10px",
                                            marginBottom:
                                                "12px"
                                        }}
                                    >
                                        <span>✓</span>

                                        <span>
                                            Select an examination programme
                                        </span>
                                    </div>


                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap:
                                                "10px"
                                        }}
                                    >
                                        <span>✓</span>

                                        <span>
                                            Continue to the available CBT
                                        </span>
                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        goToLocalExamination
                                    }
                                    style={{
                                        width:
                                            "100%",
                                        background:
                                            "#172033",
                                        color:
                                            "#ffffff",
                                        border:
                                            "none",
                                        borderRadius:
                                            "8px",
                                        padding:
                                            "14px 18px",
                                        fontSize:
                                            "15px",
                                        fontWeight:
                                            "700",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    ENTER LOCAL EXAMINATION
                                </button>

                            </article>


                            {/* ==================================================
                                INTERNATIONAL EXAMINATION
                            ================================================== */}

                            <article
                                style={{
                                    background:
                                        "#ffffff",
                                    border:
                                        "1px solid #e1e6ee",
                                    borderRadius:
                                        "14px",
                                    padding:
                                        "34px",
                                    boxShadow:
                                        "0 8px 25px rgba(20, 35, 60, 0.06)"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize:
                                            "42px",
                                        marginBottom:
                                            "18px"
                                    }}
                                >
                                    {"\u{1F30D}"}
                                </div>


                                <h3
                                    style={{
                                        margin:
                                            "0 0 14px",
                                        fontSize:
                                            "27px"
                                    }}
                                >
                                    International Examination
                                </h3>


                                <p
                                    style={{
                                        color:
                                            "#596579",
                                        lineHeight:
                                            "1.7",
                                        margin:
                                            "0 0 22px"
                                    }}
                                >
                                    Access examination programmes
                                    intended for candidates across
                                    countries and international
                                    examination environments.
                                </p>


                                <div
                                    style={{
                                        marginBottom:
                                            "25px"
                                    }}
                                >

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap:
                                                "10px",
                                            marginBottom:
                                                "12px"
                                        }}
                                    >
                                        <span>✓</span>

                                        <span>
                                            International examination
                                            pathway
                                        </span>
                                    </div>


                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap:
                                                "10px",
                                            marginBottom:
                                                "12px"
                                        }}
                                    >
                                        <span>✓</span>

                                        <span>
                                            Examination-specific
                                            requirements
                                        </span>
                                    </div>


                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap:
                                                "10px"
                                        }}
                                    >
                                        <span>✓</span>

                                        <span>
                                            Dedicated international
                                            examination environment
                                        </span>
                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        goToInternationalExamination
                                    }
                                    style={{
                                        width:
                                            "100%",
                                        background:
                                            "#ffffff",
                                        color:
                                            "#172033",
                                        border:
                                            "1px solid #172033",
                                        borderRadius:
                                            "8px",
                                        padding:
                                            "14px 18px",
                                        fontSize:
                                            "15px",
                                        fontWeight:
                                            "700",
                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    ENTER INTERNATIONAL EXAMINATION
                                </button>

                            </article>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    CANDIDATE INFORMATION
                ================================================== */}

                <section
                    style={{
                        background:
                            "#ffffff",
                        borderTop:
                            "1px solid #e5e9f0",
                        borderBottom:
                            "1px solid #e5e9f0",
                        padding:
                            "55px 24px"
                    }}
                >

                    <div
                        style={{
                            maxWidth:
                                "1000px",
                            margin:
                                "0 auto",
                            textAlign:
                                "center"
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    "13px",
                                fontWeight:
                                    "800",
                                letterSpacing:
                                    "1.5px",
                                marginBottom:
                                    "10px"
                            }}
                        >
                            FOR CANDIDATES
                        </div>


                        <h2
                            style={{
                                margin:
                                    "0 0 18px",
                                fontSize:
                                    "30px"
                            }}
                        >
                            Everything Starts With the
                            Right Examination Path
                        </h2>


                        <p
                            style={{
                                maxWidth:
                                    "760px",
                                margin:
                                    "0 auto",
                                color:
                                    "#596579",
                                lineHeight:
                                    "1.7"
                            }}
                        >
                            Before beginning an examination, make
                            sure you select the correct country,
                            examination programme and examination
                            type. SmartExam uses structured
                            examination pathways to help candidates
                            reach the correct CBT.
                        </p>

                    </div>

                </section>


                {/* ==================================================
                    ACCOUNT CTA
                ================================================== */}

                <section
                    style={{
                        padding:
                            "65px 24px",
                        textAlign:
                            "center",
                        background:
                            "#f7f9fc"
                    }}
                >

                    <div
                        style={{
                            maxWidth:
                                "720px",
                            margin:
                                "0 auto"
                        }}
                    >

                        <h2
                            style={{
                                margin:
                                    "0 0 15px",
                                fontSize:
                                    "32px"
                            }}
                        >
                            Ready to Continue?
                        </h2>


                        <p
                            style={{
                                margin:
                                    "0 auto 28px",
                                color:
                                    "#596579",
                                lineHeight:
                                    "1.7"
                            }}
                        >
                            Login to your SmartExam account or
                            register as a new candidate to continue.
                        </p>


                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "center",
                                gap: "12px",
                                flexWrap:
                                    "wrap"
                            }}
                        >

                            <button
                                type="button"
                                onClick={goToLogin}
                                style={{
                                    background:
                                        "#172033",
                                    color:
                                        "#ffffff",
                                    border:
                                        "none",
                                    borderRadius:
                                        "8px",
                                    padding:
                                        "13px 28px",
                                    fontWeight:
                                        "700",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                LOGIN
                            </button>


                            <button
                                type="button"
                                onClick={goToRegister}
                                style={{
                                    background:
                                        "#ffffff",
                                    color:
                                        "#172033",
                                    border:
                                        "1px solid #cbd3df",
                                    borderRadius:
                                        "8px",
                                    padding:
                                        "13px 28px",
                                    fontWeight:
                                        "700",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                REGISTER
                            </button>

                        </div>

                    </div>

                </section>

            </main>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <footer
                style={{
                    background:
                        "#172033",
                    color:
                        "#ffffff",
                    padding:
                        "30px 24px"
                }}
            >

                <div
                    style={{
                        maxWidth:
                            "1080px",
                        margin:
                            "0 auto",
                        display:
                            "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        gap:
                            "20px",
                        flexWrap:
                            "wrap"
                    }}
                >

                    <div>

                        <div
                            style={{
                                fontSize:
                                    "23px",
                                fontWeight:
                                    "800",
                                marginBottom:
                                    "7px"
                            }}
                        >
                            SMARTEXAM
                        </div>


                        <div
                            style={{
                                color:
                                    "#c4ccda",
                                fontSize:
                                    "14px"
                            }}
                        >
                            English CBT Platform
                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={goBackHome}
                        style={{
                            background:
                                "transparent",
                            color:
                                "#ffffff",
                            border:
                                "1px solid #667085",
                            borderRadius:
                                "7px",
                            padding:
                                "10px 18px",
                            cursor:
                                "pointer"
                        }}
                    >
                        Back to SmartExam
                    </button>


                    <div
                        style={{
                            width:
                                "100%",
                            color:
                                "#aeb7c6",
                            fontSize:
                                "13px",
                            borderTop:
                                "1px solid #394458",
                            paddingTop:
                                "20px"
                        }}
                    >
                        © {new Date().getFullYear()} SmartExam.
                        All rights reserved.
                    </div>

                </div>

            </footer>

        </div>
    );
}

export default EnglishPlatformPage;