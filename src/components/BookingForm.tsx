// src/components/BookingForm.tsx
import React, { useState, useEffect } from "react";
import "./BookingForm.css";

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

export default function BookingForm({
  selectedDate,
  onSubmit,
  artistName,
}: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [selectedArtistName, setSelectedArtistName] = useState(artistName);

  const [formData, setFormData] = useState<BookingData>({
    name: "",
    email: "",
    idea: "",
    paymentMethod: "",
    confirmationCode: "",
  });

  useEffect(() => {
    console.log("Artist name changed:", artistName);
    setSelectedArtistName(artistName);
  }, [artistName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        {selectedArtistName 
          ? `Booking with ${selectedArtistName} ${selectedDate ? `on ${selectedDate}` : ""}`
          : "Select your artist and date"}
      </h3>

      {step === 1 && (
        <div className="form-step">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="form-step">
          <label>
            Tattoo Idea / Notes
            <textarea
              name="idea"
              value={formData.idea}
              onChange={handleChange}
              rows={4}
              required
            />
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
              required
            />
          </label>
          <label>
            Confirmation Code
            <input
              type="text"
              name="confirmationCode"
              value={formData.confirmationCode}
              onChange={handleChange}
              required
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
