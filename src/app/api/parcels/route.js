
import { prisma } from "../../../lib/prisma";

// Validate parcel information (used by POST and PUT)
function validateParcelData(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Invalid parcel information." };
  }

  const {
    referenceNo,
    receiverName,
    phone,
    description,
  } = body;

  // Check required fields are strings
  if (
    typeof referenceNo !== "string" ||
    typeof receiverName !== "string" ||
    typeof phone !== "string"
  ) {
    return {
      error: "Reference number, receiver name and phone are required.",
    };
  }

  // Normalize values
  const cleanReferenceNo = referenceNo.trim().toUpperCase();
  const cleanReceiverName = receiverName.trim();
  const cleanPhone = phone.replace(/[\s-]/g, "");
  const cleanDescription =
    description == null ? "" : description;

  // Reference number validation
  if (!cleanReferenceNo) {
    return { error: "Reference number is required." };
  }

  if (cleanReferenceNo.length > 50) {
    return {
      error: "Reference number cannot exceed 50 characters.",
    };
  }

  // Receiver name validation
  const namePattern = /^[\p{L}\s.'-]+$/u;

  if (!cleanReceiverName) {
    return { error: "Receiver name is required." };
  }

  if (!namePattern.test(cleanReceiverName)) {
    return {
      error: "Receiver name can contain only letters, spaces, apostrophes, periods and hyphens.",
    };
  }

  if (cleanReceiverName.length > 100) {
    return {
      error: "Receiver name cannot exceed 100 characters.",
    };
  }

  // Phone number validation
  const phonePattern = /^(?:0\d{9}|\+94\d{9})$/;

  if (!phonePattern.test(cleanPhone)) {
    return {
      error: "Please enter a valid Sri Lankan phone number (0771234567 or +94771234567).",
    };
  }

  if (cleanPhone.length > 15) {
    return {
      error: "Phone number cannot exceed 15 characters.",
    };
  }

  // Description validation
  if (typeof cleanDescription !== "string") {
    return {
      error: "Description must be text.",
    };
  }

  if (cleanDescription.trim().length > 500) {
    return {
      error: "Description cannot exceed 500 characters.",
    };
  }

  return {
    data: {
      referenceNo: cleanReferenceNo,
      receiverName: cleanReceiverName,
      phone: cleanPhone,
      description: cleanDescription.trim() || null,
    },
  };
}

// GET: Retrieve all parcels
export async function GET() {
  try {
    const parcels = await prisma.parcel.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      data: parcels,
    });
  } catch (error) {
    console.error("GET ERROR:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to retrieve parcels",
      },
      { status: 500 }
    );
  }
}

// POST: Add a new parcel
export async function POST(request) {
  try {
    const body = await request.json();

    const validation = validateParcelData(body);

    if (validation.error) {
      return Response.json(
        {
          success: false,
          message: validation.error,
        },
        { status: 400 }
      );
    }

    const newParcel = await prisma.parcel.create({
      data: validation.data,
    });

    return Response.json(
      {
        success: true,
        message: "Parcel added successfully!",
        data: newParcel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST ERROR:", error);

    if (error.code === "P2002") {
      return Response.json(
        {
          success: false,
          message: "This reference number already exists.",
        },
        { status: 409 }
      );
    }

    if (error instanceof SyntaxError) {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON request.",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Failed to add parcel",
      },
      { status: 500 }
    );
  }
}

// PATCH: Update parcel status
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body || {};

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0 ||
      status !== "Collected"
    ) {
      return Response.json(
        {
          success: false,
          message: "Valid parcel ID and status are required",
        },
        { status: 400 }
      );
    }

    const updatedParcel = await prisma.parcel.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "Collected",
      },
    });

    return Response.json({
      success: true,
      message: "Parcel marked as collected!",
      data: updatedParcel,
    });
  } catch (error) {
    console.error("PATCH ERROR:", error);

    if (error.code === "P2025") {
      return Response.json(
        {
          success: false,
          message: "Parcel not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Failed to update parcel status",
      },
      { status: 500 }
    );
  }
}

// PUT: Edit parcel details
export async function PUT(request) {
  try {
    const body = await request.json();

    const { id } = body || {};

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      return Response.json(
        {
          success: false,
          message: "A valid parcel ID is required.",
        },
        { status: 400 }
      );
    }

    const validation = validateParcelData(body);

    if (validation.error) {
      return Response.json(
        {
          success: false,
          message: validation.error,
        },
        { status: 400 }
      );
    }

    const updatedParcel = await prisma.parcel.update({
      where: {
        id: Number(id),
      },
      data: validation.data,
    });

    return Response.json({
      success: true,
      message: "Parcel details updated successfully!",
      data: updatedParcel,
    });
  } catch (error) {
    console.error("PUT ERROR:", error);

    if (error.code === "P2002") {
      return Response.json(
        {
          success: false,
          message: "This reference number already exists.",
        },
        { status: 409 }
      );
    }

    if (error.code === "P2025") {
      return Response.json(
        {
          success: false,
          message: "Parcel not found.",
        },
        { status: 404 }
      );
    }

    if (error instanceof SyntaxError) {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON request.",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Failed to update parcel details",
      },
      { status: 500 }
    );
  }
}

// DELETE: Remove a parcel
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body || {};

    if (
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      return Response.json(
        {
          success: false,
          message: "A valid parcel ID is required",
        },
        { status: 400 }
      );
    }

    const deletedParcel = await prisma.parcel.delete({
      where: {
        id: Number(id),
      },
    });

    return Response.json({
      success: true,
      message: "Parcel deleted successfully!",
      data: deletedParcel,
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    if (error.code === "P2025") {
      return Response.json(
        {
          success: false,
          message: "Parcel not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Failed to delete parcel",
      },
      { status: 500 }
    );
  }
}
