
import React, { useState } from "react";
import {
    useNavigate,
    useLocation
} from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../api/api";
import "./InternationalAuth.css";

const InternationalLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Preserve the selected examination and package.
    const returnState = location.state || {};

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim() || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${BASE_URL}/international/auth/login`,
                {
                    email: formData.email.trim(),
                    password: formData.password
                }
            );

            const { token, user } = response.data;

            if (!response.data.success || !token || !user) {
                throw new Error(
                    response.data.message ||
                    "Invalid login response."
                );
            }

            // Store International CBT credentials separately.
            localStorage.setItem("internationalToken", token);
            localStorage.setItem(
                "internationalUser",
                JSON.stringify(user)
            );

            const returnTo = returnState.returnTo;

            // Return to the selected International examination.
            if (
                typeof returnTo === "string" &&
                returnTo.startsWith("/international/") &&
                returnTo !== "/international/login" &&
                returnTo !== "/international/register"
            ) {
                navigate(returnTo, {
                    state: {
                        selectedPackageCode:
                            returnState.selectedPackageCode,

                        selectedExamCodes:
                            returnState.selectedExamCodes,

                        // Confirms that Login was completed.
                        // Payment must wait for another Proceed click.
                        internationalLoginCompleted: true
                    },
                    replace: true
                });
            } else {
                navigate("/international", {
                    replace: true
                });
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="international-auth-container">
            <div className="international-auth-card">

                <h2>International CBT Login</h2>

                <p>
                    Welcome back! Please log in to continue.
                </p>

                {error && (
                    <div className="international-auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="international-auth-form-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="international-auth-form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="international-auth-link">
                    Don't have an account?{" "}

                    <span
                        onClick={() =>
                            navigate(
                                "/international/register",
                                {
                                    state: returnState
                                }
                            )
                        }
                    >
                        Register here
                    </span>
                </p>

            </div>
        </div>
    );
};

export default InternationalLogin;
