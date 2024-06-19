import express, { Request, Response } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ["https://script.google.com"];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1 ) { //|| !origin 
      console.log('Origin ok')
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

//To be triggered and used exclusively by Etherscan's team
app.get("/returnExplorerTag", async (req: Request, res: Response) => {
  const url: string = req.query.url as string;
  const elementSelector = ".hash-tag.text-truncate.lh-sm.my-n1";
  if (!url || !elementSelector) {
    return res.status(400).json({ error: "Missing url or selector parameter" });
  }

  try {
    // Fetch the web page
    const { data } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Find and extract the contents of the specified element
    const elementContent = $(elementSelector).text().trim();

    // Return the extracted content
    res.json({ tag: elementContent });
  } catch (error) {
    console.error("Error fetching the web page:", error);
    res.status(500).json({ error: "Error fetching the web page" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
