
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch parcels from the database
  useEffect(() => {
    async function fetchParcels() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/parcels");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load parcel records."
          );
        }

        setParcels(result.data);

      } catch (error) {
        setError(error.message);

      } finally {
        setLoading(false);
      }
    }

    fetchParcels();
  }, []);

  // Calculate dashboard statistics
  const totalParcels = parcels.length;

  const availableParcels = parcels.filter(
    (parcel) => parcel.status === "Available"
  ).length;

  const collectedParcels = parcels.filter(
    (parcel) => parcel.status === "Collected"
  ).length;

  // Get the five most recent parcels
  const recentParcels = parcels.slice(0, 5);

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
            className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-700"
          >
            Dashboard
          </Link>

          <Link
            href="/add-parcel"
            className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-700"
          >
            Add Parcel
          </Link>

          <Link
            href="/manage-parcel"
            className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-700"
          >
            Manage Parcels
          </Link>

        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-5 sm:p-6">

        {/* Page Heading */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Overview of your parcel collection records.
            </p>
          </div>

          <Link
            href="/add-parcel"
            className="rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800"
          >
            + Add New Parcel
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Parcels */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Parcels
                </p>

                <h3 className="mt-3 text-3xl font-bold text-gray-800">
                  {loading ? "..." : totalParcels}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-700">
                📦
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              All registered parcels
            </p>
          </div>

          {/* Available Parcels */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Available Parcels
                </p>

                <h3 className="mt-3 text-3xl font-bold text-gray-800">
                  {loading ? "..." : availableParcels}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-xl text-orange-600">
                🕒
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Waiting for collection
            </p>
          </div>

          {/* Collected Parcels */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Collected Parcels
                </p>

                <h3 className="mt-3 text-3xl font-bold text-gray-800">
                  {loading ? "..." : collectedParcels}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
                ✓
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Successfully collected parcels
            </p>
          </div>

        </div>

        {/* Recent Parcels Section */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Recent Parcels
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Latest parcel records added to the system.
              </p>
            </div>

            <Link
              href="/manage-parcel"
              className="text-sm font-semibold text-red-700 hover:text-red-900"
            >
              View All Parcels →
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-10 text-center text-gray-500">
              Loading parcel records...
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && recentParcels.length === 0 && (
            <div className="p-10 text-center">
              <div className="mb-3 text-4xl">📦</div>

              <h4 className="font-semibold text-gray-700">
                No parcels found
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                Add your first parcel to see records here.
              </p>

              <Link
                href="/add-parcel"
                className="mt-5 inline-block rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
              >
                Add New Parcel
              </Link>
            </div>
          )}

          {/* Parcels Table */}
          {!loading && recentParcels.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">

                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Reference Number
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Receiver Name
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {recentParcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-800">
                        {parcel.referenceNo}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {parcel.receiverName}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            parcel.status === "Available"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {parcel.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Link
                          href="/manage-parcel"
                          className="font-semibold text-red-700 hover:text-red-900"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {!loading && recentParcels.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-sm text-gray-500">
              Showing {recentParcels.length} recent parcel records
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
