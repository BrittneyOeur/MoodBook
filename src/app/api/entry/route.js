import { connectDB } from "@/app/server/utils/db";
import Entry from "@/app/server/models/Entry";
import { verifyToken } from "@/app/server/middleware/auth";  // Named import

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("Authorization");
    const user = await verifyToken(authHeader);

    if (!user) {
      console.error("Unauthorized access attempt");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Verified User ID:", user.sub); // Debugging

    const entries = await Entry.find({ userId: user.sub });

    return Response.json({ entries });
  } catch (error) {
    console.error("Error fetching entries:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log("Request Headers:", req.headers);
    await connectDB();

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return Response.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    const user = await verifyToken(authHeader); // Verify token and get user info

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Verified User ID:", user.sub);

    // Parse request body
    const body = await req.json();
    let { date, time, mood, description, activities } = body;

    if (!date || !mood) {
      return Response.json({ error: "Date and mood are required" }, { status: 400 });
    }

    // Ensure `date` is formatted correctly (YYYY-MM-DD)
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return Response.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Adjust the date to the user's local time
    const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000);

    // Format the date as "yyyy-mm-dd"
    date = localDate.toISOString().split("T")[0]; // Extract the "yyyy-mm-dd" part

    // Format `time` if it's missing
    if (!time) {
      time = parsedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // Create and save new entry
    const newEntry = new Entry({
      userId: user.sub,
      date, // Now correctly formatted as "YYYY-MM-DD"
      time, // Now properly formatted as "hh:mm A"
      mood,
      description,
      activities,
    });

    await newEntry.save();

    console.log("Entry saved:", newEntry);

    return Response.json({ message: "Entry saved successfully", entry: newEntry }, { status: 201 });

  } catch (error) {
    console.error("Error in API route:", error);
    return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return Response.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    const user = await verifyToken(authHeader);

    if (!user) {
      console.error("Unauthorized access attempt");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Verified User ID:", user.sub); // Debugging

    // Get entry ID from request body
    const { entryId } = await req.json();

    if (!entryId) {
      return Response.json({ error: "Missing entry ID" }, { status: 400 });
    }

    // Delete the entry belonging to the authenticated user
    const deletedEntry = await Entry.findOneAndDelete({ _id: entryId, userId: user.sub });

    if (!deletedEntry) {
      return Response.json({ error: "Entry not found or not authorized" }, { status: 404 });
    }

    return Response.json({ message: "Entry deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error in deletion:", error);
    return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("Authorization");
    const user = await verifyToken(authHeader);

    if (!user) {
      console.error("Unauthorized access attempt");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entryId, mood, description, activities } = await req.json();

    if (!entryId) {
      return Response.json({ error: "Entry ID is required" }, { status: 400 });
    }

    const updatedEntry = await Entry.findOneAndUpdate(
      { _id: entryId, userId: user.sub }, // Ensure the user owns the entry
      { mood, description, activities }, // Update fields
      { new: true } // Return the updated document
    );

    if (!updatedEntry) {
      return Response.json({ error: "Entry not found or unauthorized" }, { status: 404 });
    }

    return Response.json({ entry: updatedEntry });
  } catch (error) {
    console.error("Error updating entry:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
};