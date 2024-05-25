import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from 'cors';


dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.post("/upsertAddress", async (req: Request, res: Response) => {
  const { contractAddress } = req.body;

  if (!contractAddress) {
    return res.status(400).send("Bad Request: contractAddress is required");
  }

  const credId = "415873790728261632"; // Example credential ID
  const operation = "APPEND"; // Example operation
  const items = [contractAddress]; // Use the received contractAddress

  try {
    const result = await axios.post(
      "https://graphigo.prd.galaxy.eco/query",
      {
        operationName: "credentialItems",
        query: `
          mutation credentialItems($credId: ID!, $operation: Operation!, $items: [String!]!) 
          { 
            credentialItems(input: { 
              credId: $credId, 
              operation: $operation, 
              items: $items 
            }) 
            { 
              name 
            } 
          }
        `,
        variables: {
          credId: credId,
          operation: operation,
          items: items,
        },
      },
      {
        headers: {
          "access-token": process.env.GALXE_ACCESS_TOKEN_c2F6, // Use the environment variable
        },
      }
    );

    if (result.status !== 200) {
      throw new Error(`HTTP error: ${result.status}`);
    } else if (result.data.errors && result.data.errors.length > 0) {
      console.log(result.data.errors);
      throw new Error("GraphQL error: " + JSON.stringify(result.data.errors));
    }

    res.status(200).json(result.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      res.status(500).json({ error: "Axios Error", details: error.message });
    } else if (error instanceof Error) {
      // General error handling
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    } else {
      // Fallback for unknown error types
      res.status(500).json({ error: "Unknown Error" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
