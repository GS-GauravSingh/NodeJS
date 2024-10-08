import { nanoid } from "nanoid";
import URL from "../models/urlModel.js";

// Function to generate new short unique id.
async function handleGenerateNewShortURL(req, res) {
    // Check if the URL is provided in the request body
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({
            msg: "Bad Request: URL is missing",
        });
    }

    // Generating a unique ID of length 8
    const shortID = nanoid(8);

    try {
        // Save the new URL entry in the database
        const result = await URL.create({
            shortID: shortID,
            redirectURL: url,
            visitHistory: [],
        });

        // If creation is successful, send a success response
        return res.json({
            msg: "Operation Successful",
            id: shortID,
        });

    } catch (error) {
        console.error("An error occurred while generating the short unique ID:", error);
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error.message,
        });
    }
}

// Function to get details about how many time a particular URL is visited.
async function handleGetAnalytics(req, res) {

    const shortID = req.params.shortID;

    try {
        // Save the new URL entry in the database
        const result = await URL.findOne({ shortID: shortID });

        return res.json({
            msg: "Operation Successful",
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory
        });

    } catch (error) {
        console.error("An error occurred while fetching analytics");
        return res.status(500).json({
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

export { handleGenerateNewShortURL, handleGetAnalytics };
