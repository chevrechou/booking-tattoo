import React, { useState } from "react";
import "./BookingForm.css"; // Assuming you have some styles for the form

type BookingFormProps = {
    selectedDate?: string;
    artistName?: string;
    onSubmit: (data: BookingData) => void;
};

type BookingData = {
    name: string;
    email: string;
    idea: string;
    paymentMethod: string;
    confirmationCode: string;
};

export default function BookingForm({ selectedDate, onSubmit, artistName }: BookingFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<BookingData>({
        name: "",
        email: "",
        idea: "",
        paymentMethod: "",
        confirmationCode: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleFinalSubmit = () => {
        onSubmit(formData);
    };

    return (
        <div className="form-panel">
            <h3>
                {artistName && selectedDate
                    ? `Booking with ${artistName} on ${selectedDate}`
                    : "Booking Form"}
            </h3>            {step === 1 && (
                <div className="form-step">
                    <label>
                        Name
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </label>
                    <label>
                        Email
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </label>
                    <button onClick={handleNext}>Next</button>
                </div>
            )}

            {step === 2 && (
                <div className="form-step">
                    <label>
                        Tattoo Idea / Notes
                        <textarea name="idea" value={formData.idea} onChange={handleChange} rows={4} />
                    </label>
                    <div className="step-buttons">
                        <button onClick={handleBack}>Back</button>
                        <button onClick={handleNext}>Next</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="form-step">
                    <label>
                        Payment Method (Zelle, Venmo, PayPal)
                        <input
                            type="text"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Confirmation Code
                        <input
                            type="text"
                            name="confirmationCode"
                            value={formData.confirmationCode}
                            onChange={handleChange}
                        />
                    </label>
                    <div className="step-buttons">
                        <button onClick={handleBack}>Back</button>
                        <button onClick={handleFinalSubmit}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
}
