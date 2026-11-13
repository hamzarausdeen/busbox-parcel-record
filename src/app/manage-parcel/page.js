
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ManageParcel() {
  const [parcels, setParcels] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [collectingId, setCollectingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [editingParcel, setEditingParcel] = useState(null);
  const [editForm, setEditForm] = useState({
    referenceNo: "",
    receiverName: "",
    phone: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  // Fetch parcels
  async function fetchParcels() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/parcels");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load parcels");
      }

      setParcels(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchParcels();
  }, []);

  // Dashboard statistics
  const totalParcels = parcels.length;
  const availableParcels = parcels.filter(
    (parcel) => parcel.status === "Available"
  ).length;
  const collectedParcels = parcels.filter(
    (parcel) => parcel.status === "Collected"
  ).length;

  // Open edit modal
  function handleEdit(parcel) {
    setEditingParcel(parcel);

    setEditForm({
      referenceNo: parcel.referenceNo,
      receiverName: parcel.receiverName,
      phone: parcel.phone,
      description: parcel.description || "",
    });

    setEditMessage("");
  }

  // Update edit form fields
  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setEditMessage("");
  }

  // Update parcel
  async function handleUpdate(event) {
    event.preventDefault();

    const referenceNo = editForm.referenceNo.trim().toUpperCase();
    const receiverName = editForm.receiverName.trim();
    const phone = editForm.phone.replace(/[\s-]/g, "");
    const description = editForm.description.trim();

    if (!referenceNo) {
      setEditMessage("Please enter a reference number.");
      return;
    }

    if (referenceNo.length > 50) {
      setEditMessage("Reference number cannot exceed 50 characters.");
      return;
    }

    const namePattern = /^[\p{L}\s.'-]+$/u;

    if (!receiverName || !namePattern.test(receiverName)) {
      setEditMessage("Please enter a valid receiver name.");
      return;
    }

    if (receiverName.length > 100) {
      setEditMessage("Receiver name cannot exceed 100 characters.");
      return;
    }

    const phonePattern = /^(?:0\d{9}|\+94\d{9})$/;

    if (!phonePattern.test(phone)) {
      setEditMessage(
        "Enter a valid phone number (0771234567 or +94771234567)."
      );
      return;
    }

    if (description.length > 500) {
      setEditMessage("Description cannot exceed 500 characters.");
      return;
    }

    setSaving(true);
    setEditMessage("");

    try {
      const response = await fetch("/api/parcels", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingParcel.id,
          referenceNo,
          receiverName,
          phone,
          description,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update parcel.");
      }

      setParcels((current) =>
        current.map((parcel) =>
          parcel.id === result.data.id ? result.data : parcel
        )
      );

      setEditingParcel(null);
      alert("Parcel updated successfully!");
    } catch (err) {
      setEditMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Collect parcel
  async function collectParcel(id) {
    try {
      setCollectingId(id);

      const response = await fetch("/api/parcels", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: "Collected",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to collect parcel.");
      }

      setParcels((current) =>
        current.map((parcel) =>
          parcel.id === id ? result.data : parcel
        )
      );

      alert("Parcel collected successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setCollectingId(null);
    }
  }

  // Delete parcel
  async function deleteParcel(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this parcel? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const response = await fetch("/api/parcels", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete parcel.");
      }

      setParcels((current) =>
        current.filter((parcel) => parcel.id !== id)
      );

      alert("Parcel deleted successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  // Search and filter
  const filteredParcels = parcels.filter((parcel) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      parcel.referenceNo.toLowerCase().includes(searchValue) ||
      parcel.receiverName.toLowerCase().includes(searchValue) ||
      parcel.phone.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" || parcel.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-700 px-6 py-5 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
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
            className="rounded-lg px-4 py-2 font-medium text-gray-600 hover:bg-red-50 hover:text-red-700"
          >
            Add Parcel
          </Link>

          <Link
            href="/manage-parcel"
            className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-700"
          >
            Manage Parcels
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl space-y-7 p-5 sm:p-6">
        {/* Page heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Manage Parcels
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View, search, edit and manage parcel collection records.
            </p>
          </div>

          <button
            onClick={fetchParcels}
            disabled={loading}
            className="rounded-lg bg-red-700 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-red-800 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Records"}
          </button>
        </div>

        {/* Statistics cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Parcels
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-800">
              {totalParcels}
            </p>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Available Parcels
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {availableParcels}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Collected Parcels
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-700">
              {collectedParcels}
            </p>
          </div>
        </section>

        {/* Search and filters */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">
            Search and Filter Parcels
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                placeholder="Search reference number, receiver or phone..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Collected">Collected</option>
              </select>
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="font-medium text-gray-600">
              Loading parcel records...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-medium">{error}</p>
            <button
              onClick={fetchParcels}
              className="mt-3 font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Parcel table */}
        {!loading && !error && (
          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Parcel Records
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredParcels.length} matching records
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-red-700 text-sm text-white">
                  <tr>
                    <th className="px-5 py-4">Reference No.</th>
                    <th className="px-5 py-4">Receiver</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredParcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="transition hover:bg-red-50/40"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-800">
                        {parcel.referenceNo}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {parcel.receiverName}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {parcel.phone}
                      </td>

                      <td className="max-w-xs truncate px-5 py-4 text-gray-600">
                        {parcel.description || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            parcel.status === "Available"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {parcel.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(parcel)}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          {parcel.status === "Available" && (
                            <button
                              onClick={() => collectParcel(parcel.id)}
                              disabled={collectingId === parcel.id}
                              className="rounded-lg bg-red-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-800 disabled:opacity-50"
                            >
                              {collectingId === parcel.id
                                ? "Updating..."
                                : "Collect"}
                            </button>
                          )}

                          <button
                            onClick={() => deleteParcel(parcel.id)}
                            disabled={deletingId === parcel.id}
                            className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                          >
                            {deletingId === parcel.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredParcels.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-12 text-center text-gray-500"
                      >
                        No parcel records found.
                        <p className="mt-1 text-sm">
                          Try changing your search or status filter.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t bg-gray-50 px-5 py-3 text-sm text-gray-500">
              Showing {filteredParcels.length} of {parcels.length} parcels
            </div>
          </section>
        )}
      </main>

      {/* Edit Parcel Modal */}
      {editingParcel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between rounded-t-2xl bg-red-700 px-6 py-5 text-white">
              <div>
                <h2 className="text-xl font-bold">Edit Parcel</h2>
                <p className="mt-1 text-sm text-red-100">
                  Update parcel information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingParcel(null)}
                disabled={saving}
                className="text-3xl leading-none text-white hover:text-red-200 disabled:opacity-50"
                aria-label="Close edit form"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Reference Number *
                </label>
                <input
                  type="text"
                  name="referenceNo"
                  value={editForm.referenceNo}
                  onChange={handleEditChange}
                  maxLength={50}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Receiver Name *
                </label>
                <input
                  type="text"
                  name="receiverName"
                  value={editForm.receiverName}
                  onChange={handleEditChange}
                  maxLength={100}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  maxLength={15}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Example: 0771234567 or +94771234567
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Parcel Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {editForm.description.length}/500 characters
                </p>
              </div>

              {editMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {editMessage}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setEditingParcel(null)}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-red-700 px-5 py-2.5 font-medium text-white transition hover:bg-red-800 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
