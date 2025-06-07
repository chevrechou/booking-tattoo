// src/components/BookingForm.tsx
import React, { useState, useEffect } from "react";
import "./BookingForm.css";
import { toast } from "react-toastify";

type BookingFormProps = {
  selectedDate?: string;
  artistName?: string;
  onSubmit: (data: BookingData) => void;
  resetSignal?: boolean;
};

export type BookingData = {
  name: string;
  email: string;
  idea: string;
  paymentMethod: string;
  confirmationCode: string;
  imageFile?: File | null;
};

export default function BookingForm({
  selectedDate,
  onSubmit,
  artistName,
  resetSignal = false,
}: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [selectedArtistName, setSelectedArtistName] = useState(artistName);

  const [formData, setFormData] = useState<BookingData>({
    name: "",
    email: "",
    idea: "",
    paymentMethod: "",
    confirmationCode: "",
    imageFile: null,
  });

  useEffect(() => {
    setSelectedArtistName(artistName);
  }, [artistName]);

  useEffect(() => {
  if (resetSignal) {
    setStep(1);
    setFormData({
      name: "",
      email: "",
      idea: "",
      paymentMethod: "",
      confirmationCode: "",
    });
  }
}, [resetSignal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageFile: e.target.files![0],
      }));
    }
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      toast.error("Please enter your name and email.");
      return;
    }
    if (step === 2 && !formData.idea) {
      toast.error("Please describe your tattoo idea.");
      return;
    }
    if (step === 3 && (!formData.paymentMethod || !formData.confirmationCode)) {
      toast.error("Please enter payment method and confirmation code.");
      return;
    }
    setStep((prev) => prev + 1);
  };

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
          <label>
            Reference Image (optional)
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
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
            <button onClick={handleNext}>Review</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="form-step">
          <h4>Review Your Booking</h4>
          <ul className="summary-list">
            <li><strong>Artist:</strong> {selectedArtistName}</li>
            <li><strong>Date:</strong> {selectedDate}</li>
            <li><strong>Name:</strong> {formData.name}</li>
            <li><strong>Email:</strong> {formData.email}</li>
            <li><strong>Idea:</strong> {formData.idea}</li>
            <li><strong>Payment:</strong> {formData.paymentMethod}</li>
            <li><strong>Code:</strong> {formData.confirmationCode}</li>
          </ul>
          <div className="step-buttons">
            <button onClick={handleBack}>Back to Edit</button>
            <button onClick={handleFinalSubmit}>Submit Booking</button>
          </div>
        </div>
      )}
    </div>
  );
}
