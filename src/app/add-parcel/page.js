
"use client";

import Link from "next/link";
import { useState } from "react";

export default function AddParcel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [descriptionLength, setDescriptionLength] = useState(0);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const referenceNo = formData
      .get("referenceNo")
      .trim()
      .toUpperCase();

    const receiverName = formData
      .get("receiverName")
      .trim();

    const phone = formData
      .get("phone")
      .trim()
      .replace(/[\s-]/g, "");

    const description = formData
      .get("description")
      .trim();

    setMessage("");
    setMessageType("");

    if (!referenceNo) {
      setMessage("Please enter a reference number.");
      setMessageType("error");
      return;
    }

    if (referenceNo.length > 50) {
      setMessage("Reference number cannot exceed 50 characters.");
      setMessageType("error");
      return;
    }

    if (!receiverName) {
      setMessage("Please enter the receiver name.");
      setMessageType("error");
      return;
    }

    if (receiverName.length > 100) {
      setMessage("Receiver name cannot exceed 100 characters.");
      setMessageType("error");
      return;
    }

    if (!/^[\p{L}\s.'-]+$/u.test(receiverName)) {
      setMessage("Receiver name contains invalid characters.");
      setMessageType("error");
      return;
    }

    const phonePattern = /^(?:0\d{9}|\+94\d{9})$/;

    if (!phonePattern.test(phone)) {
      setMessage(
        "Enter a valid phone number (0771234567 or +94771234567)."
      );
      setMessageType("error");
      return;
    }

    if (description.length > 500) {
      setMessage("Description cannot exceed 500 characters.");
      setMessageType("error");
      return;
    }

    const parcelData = {
      referenceNo,
      receiverName,
      phone,
      description,
    };

    try {
      setLoading(true);

      const response = await fetch("/api/parcels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parcelData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to add parcel."
        );
      }

      form.reset();
      setDescriptionLength(0);

      setMessage("Parcel added successfully!");
      setMessageType("success");

    } catch (error) {
      setMessage(error.message);
      setMessageType("error");

    } finally {
      setLoading(false);
    }
  }

  function clearMessage() {
    setMessage("");
    setMessageType("");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-700 px-6 py-5 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">BusBox</h1>
            <p className="mt-1 text-sm text-red-100">
              Parcel Collection Record System
            </p>
          </div>

          <span className="rounded-full bg-red-600 px-4 py-2 text-sm">
            Admin Panel
          </span>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-6 py-3">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 font-medium text-gray-600 hover:bg-red-50 hover:text-red-700"
          >
            Dashboard
          </Link>

          <Link
            href="/add-parcel"
            className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-700"
          >
            Add Parcel
          </Link>

          <Link
            href="/manage-parcel"
            className="rounded-lg px-4 py-2 font-medium text-gray-600 hover:bg-red-50 hover:text-red-700"
          >
            Manage Parcels
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-5 sm:p-6">
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-gray-800">
            Add New Parcel
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enter the parcel information below to create a new collection record.
          </p>
        </div>

        {/* Form Card */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 border-b border-gray-100 pb-5">
            <h3 className="text-lg font-bold text-gray-800">
              Parcel Information
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Fields marked with * are required.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
          >
            {/* Reference Number */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reference Number *
              </label>

              <input
                type="text"
                name="referenceNo"
                placeholder="Enter reference number"
                maxLength={50}
                required
                onChange={clearMessage}
                className="w-full rounded-lg border border-gray-300 p-3 uppercase outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Example: BB001 or 123456
              </p>
            </div>

            {/* Receiver Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Receiver Name *
              </label>

              <input
                type="text"
                name="receiverName"
                placeholder="Enter receiver full name"
                maxLength={100}
                required
                onChange={clearMessage}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number *
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="0771234567"
                maxLength={15}
                required
                onChange={clearMessage}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Example: 0771234567 or +94771234567
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Parcel Description
              </label>

              <textarea
                name="description"
                placeholder="Enter parcel description (optional)"
                rows={4}
                maxLength={500}
                onChange={(event) => {
                  setDescriptionLength(event.target.value.length);
                  clearMessage();
                }}
                className="w-full resize-none rounded-lg border border-gray-300 p-3 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              />

              <p className="mt-2 text-right text-xs text-gray-400">
                {descriptionLength}/500 characters
              </p>
            </div>

            {/* Success and Error Messages */}
            {message && (
              <div
                role="alert"
                className={`rounded-lg border p-4 text-sm font-medium ${
                  messageType === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-red-700 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Saving Parcel..." : "Save Parcel"}
              </button>

              <button
                type="reset"
                onClick={() => {
                  setDescriptionLength(0);
                  clearMessage();
                }}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-7 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
