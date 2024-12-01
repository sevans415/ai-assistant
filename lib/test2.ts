import * as fs from "fs";
import * as path from "path";

// Get the absolute path to the JSON file
const jsonPath = path.join(__dirname, "givebacks2.json");

// Read and parse the JSON file
const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// Print the first item
console.log("First item:", jsonData[0]);
