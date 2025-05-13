import React, { useState, useEffect } from 'react';
import './ContactModal.css';
import { API_CONFIG } from '../../config/api.config';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDog?: boolean;
    interestUuid?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, isDog, interestUuid }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        city: '',
        state: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Reset state when modal is opened
    useEffect(() => {
        if (isOpen) {
            setFormData({
                fullName: '',
                phone: '',
                email: '',
                city: '',
                state: ''
            });
            setIsSubmitting(false);
            setIsSuccess(false);
            setIsClosing(false);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...formData,
            ...(isDog !== undefined && { isDog }),
            ...(interestUuid && { interestUuid })
        };

        try {
            const res = await fetch(`${API_CONFIG.baseUrl}/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to send contact request');

            setIsSuccess(true);

            setTimeout(() => {
                // Start closing animation
                setIsClosing(true);

                setTimeout(() => {
                    onClose();
                }, 800);
            }, 6000);

        } catch (err) {
            setIsSubmitting(false);
            alert('Error sending contact request');
            console.error(err);
        }
    };

    const getModalTitle = () => {
        if (!interestUuid) {
            return "Contact Our Pet Experts";
        } else if (isDog) {
            return "Woof! Contact About This Puppy";
        } else {
            return "Contact About Pet Products";
        }
    };

    const getSuccessMessage = () => {
        if (!interestUuid) {
            return "Thank you for reaching out to our pet family! We'll be in touch soon to discuss how we can help with your pet needs.";
        } else if (isDog) {
            return "Thank you for your interest in this adorable puppy. Our team will contact you shortly.";
        } else {
            return "Thank you for your inquiry. Our team will get back to you soon with more information.";
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
            <div className={`modal-content ${isClosing ? 'closing' : ''}`}>
                {!isSuccess ? (
                    <>
                        <h2>{getModalTitle()}</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                name="fullName"
                                type="text"
                                placeholder="Full Name"
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                            <input
                                name="phone"
                                type="text"
                                placeholder="Phone Number (e.g. (555) 123-4567)"
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address (e.g. yourname@example.com)"
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                            <input
                                name="city"
                                type="text"
                                placeholder="City"
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                            <input
                                name="state"
                                type="text"
                                placeholder="State/Province"
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                            <div className="modal-actions">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={isSubmitting ? 'submitting' : ''}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="modal-cancel-button"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="success-container">
                        <div className="success-animation">
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                        <h2 className="success-title">Contact Request Sent!</h2>
                        <p className="success-message">
                            {getSuccessMessage()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactModal;