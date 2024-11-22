const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mime = require("mime-types"); // Importing mime-types library

app.use(bodyParser.json());
app.use(cors());

// Multer middleware
const upload = multer({ storage: multer.memoryStorage() });
const user_id = "Sudhanshu_Mishra_25042003";
const email = "sudhanshu250403@gmail.com";
const roll_number = "0101CS211118";

// Helper Functions
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};
const extractAlphabets = (array) =>
  array.filter((item) => /^[a-zA-Z]$/.test(item));
const extractNumbers = (array) =>
  array.map(Number).filter((item) => !isNaN(item) && Number.isInteger(item));
const findHighestLowercase = (array) => {
  const lowercaseAlphabets = array.filter((char) => /^[a-z]$/.test(char));
  return lowercaseAlphabets.length > 0 ? lowercaseAlphabets.sort().pop() : [];
};

const decodeBase64File = (base64String) => {
  try {
    const buffer = Buffer.from(base64String, "base64");

    // Extract MIME type from the content
    const mimeType = mime.lookup(buffer) || "unknown";

    return {
      valid: true,
      sizeKB: (buffer.length / 1024).toFixed(2), // Size in KB
      mimeType,
    };
  } catch {
    return { valid: false, sizeKB: null, mimeType: null };
  }
};

// POST 
app.post("/bfhl", upload.single("file"), (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    // Validate and process data array
    const alphabets = extractAlphabets(data);
    const numbers = extractNumbers(data);
    const highest_lowercase_alphabet = findHighestLowercase(alphabets);
    const is_prime_found = numbers.some(isPrime);

    // Handle Base64-encoded file
    const fileDetails = file_b64
      ? decodeBase64File(file_b64)
      : { valid: false };

    // Response
    res.status(200).json({
      status: "success",
      user_id,
      email,
      roll_number,
      numbers,
      alphabets,
      highest_lowercase_alphabet,
      is_prime_found,
      file_valid: fileDetails.valid,
      file_mimetype: fileDetails.mimeType,
      file_size_kb: fileDetails.sizeKB,
    });
  } catch (error) {
    res.status(400).json({ is_success: false, message: error.message });
  }
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
