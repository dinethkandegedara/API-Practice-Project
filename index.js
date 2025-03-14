import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
const BASE_URL = "https://v2.jokeapi.dev/joke/";

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

/**
 * Home route renders the index page.
 */
app.get("/", (req, res) => {
  res.render("index.ejs", {});
});

/**
 * GET route for Joke API page.
 * Initially renders the page with an empty joke array.
 */
app.get("/joke-api", (req, res) => {
  res.render("jokeapi.ejs", { joke: [] });
});

/**
 * Helper function to build the JokeAPI URL based on the request form data.
 * @param {Object} body - The request body containing form data.
 * @returns {string} - The complete API URL.
 */
function buildJokeApiUrl(body) {
  let url = BASE_URL;

  // Category selection: "Any" or specific categories
  if (body["any-category"] === "yes") {
    url += "Any";
  } else {
    // If a single category is selected, it's a string; otherwise, it's an array
    if (typeof body.category === "string") {
      url += body.category;
    } else if (Array.isArray(body.category)) {
      url += body.category.join(",");
    }
  }

  // Start query parameters; add language if it's not English
  url += body.lang !== "en" ? `?lang=${body.lang}` : "?";

  // Append blacklist flags if provided
  if (
    body.blacklist &&
    (Array.isArray(body.blacklist)
      ? body.blacklist.length > 0
      : body.blacklist !== "")
  ) {
    url += url.endsWith("?") ? "blacklistFlags=" : "&blacklistFlags=";
    url += typeof body.blacklist === "string"
      ? body.blacklist
      : body.blacklist.join(",");
  }

  // Append joke type if provided (expects "single" or "twopart")
  if (body["joke type"] === "single" || body["joke type"] === "twopart") {
    url += url.endsWith("?") ? `type=${body["joke type"]}` : `&type=${body["joke type"]}`;
  }

  // Append the amount if more than one joke is requested
  if (body["joke-count"] !== "1") {
    url += `&amount=${body["joke-count"]}`;
  }

  return url;
}

/**
 * POST route to fetch jokes from the Joke API based on form input.
 */
app.post("/get-a-joke", async (req, res) => {
  try {
    // Build the API URL dynamically using the helper function.
    const apiUrl = buildJokeApiUrl(req.body);

    // Request joke data from the Joke API
    const response = await axios.get(apiUrl);
    const data = response.data;
    const jokes = [];

    // If multiple jokes are returned, process each one.
    if ("amount" in data) {
      data.jokes.forEach((jokeItem) => {
        // Handle single-part jokes
        if (jokeItem.joke) {
          jokes.push(jokeItem.joke);
        } else {
          // Handle two-part jokes by combining setup and delivery.
          jokes.push(`${jokeItem.setup}<br>${jokeItem.delivery}`);
        }
      });
    } else {
      // Single joke returned from API
      if (data.joke) {
        jokes.push(data.joke);
      } else {
        jokes.push(`${data.setup}<br>${data.delivery}`);
      }
    }

    // Render the joke API page with the fetched jokes.
    res.render("jokeapi.ejs", { joke: jokes });
  } catch (error) {
    console.error("Error fetching joke:", error);
    // Render page with error message if the API request fails.
    res.render("jokeapi.ejs", { joke: ["Failed to retrieve joke. Please try again."] });
  }
});

// Start the Express server.
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
