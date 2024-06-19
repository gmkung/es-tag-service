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
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      //
      console.log("Origin ok");
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
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
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

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
