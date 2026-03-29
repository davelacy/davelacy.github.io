// Import necessary modules
const express = require("express");

// Initialize the app
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Example GET route
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Example POST route
app.post("/data", (req, res) => {
  console.log(req.body); // Log the request body to the console
  res.status(201).send("Data received");
});

// Example PUT route
app.put("/data/:id", (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters
  console.log(`Updating data with id: ${id}`);
  res.send(`Data with id ${id} updated`);
});

// Example DELETE route
app.delete("/data/:id", (req, res) => {
  const { id } = req.params; // Extract the id from the request parameters
  console.log(`Deleting data with id: ${id}`);
  res.send(`Data with id ${id} deleted`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
