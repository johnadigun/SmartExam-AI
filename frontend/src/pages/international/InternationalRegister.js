
import React, { useState } from "react";
import {
    useNavigate,
    useLocation
} from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../api/api";
import "./InternationalAuth.css";

const InternationalRegister = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Preserve the examination and package selected before registration.
    const returnState = location.state || {};

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.email.trim() ||
            !formData.password
        ) {
            setError("Please complete all required fields.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${BASE_URL}/international/auth/register`,
                {
                    firstName: formData.firstName.trim(),
                    middleName: formData.middleName.trim(),
                    lastName: formData.lastName.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                }
            );

            if (!response.data.success || !response.data.user) {
                throw new Error(
                    response.data.message ||
                    "Registration could not be completed."
                );
            }

            setSuccess(
                "Registration successful! Your International CBT account has been created. Please proceed to login."
            );

            setFormData({
                firstName: "",
                middleName: "",
                lastName: "",
                phone: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const goToLogin = () => {
        navigate("/international/login", {
            state: returnState
        });
    };

    return (
        <div className="international-auth-container">
            <div className="international-auth-card">

                <h2>International CBT Registration</h2>

                <p>
                    Create your International CBT candidate account.
                </p>

                {error && (
                    <div className="international-auth-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className="international-auth-success"
                        role="status"
                    >
                        {success}
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit}>

                        <div className="international-auth-form-group">
                            <label>First Name *</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="international-auth-form-group">
                            <label>Middle Name (Optional)</label>
                            <input
                                type="text"
                                name="middleName"
                                placeholder="Enter your middle name"
                                value={formData.middleName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="international-auth-form-group">
                            <label>Last Name *</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="international-auth-form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="international-auth-form-group">
                            <label>Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="international-auth-form-group">
                            <label>Password *</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="international-auth-form-group">
                            <label>Confirm Password *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                minLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Register"}
                        </button>

                    </form>
                )}

                {success && (
                    <button
                        type="button"
                        onClick={goToLogin}
                    >
                        Continue to International Login
                    </button>
                )}

                {!success && (
                    <p className="international-auth-link">
                        Already have an account?{" "}

                        <span onClick={goToLogin}>
                            Login here
                        </span>
                    </p>
                )}

            </div>
        </div>
    );
};

export default InternationalRegister;
