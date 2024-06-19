"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const cheerio = __importStar(require("cheerio"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config(); // Load environment variables from .env
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/upsertAddress", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractAddress } = req.body;
    if (!contractAddress) {
        return res.status(400).send("Bad Request: contractAddress is required");
    }
    const credId = "415873790728261632"; // Example credential ID
    const operation = "APPEND"; // Example operation
    const items = [contractAddress]; // Use the received contractAddress
    try {
        const result = yield axios_1.default.post("https://graphigo.prd.galaxy.eco/query", {
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
        }, {
            headers: {
                "access-token": process.env.GALXE_ACCESS_TOKEN_c2F6, // Use the environment variable
            },
        });
        if (result.status !== 200) {
            throw new Error(`HTTP error: ${result.status}`);
        }
        else if (result.data.errors && result.data.errors.length > 0) {
            console.log(result.data.errors);
            throw new Error("GraphQL error: " + JSON.stringify(result.data.errors));
        }
        res.status(200).json(result.data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            // Axios-specific error handling
            res.status(500).json({ error: "Axios Error", details: error.message });
        }
        else if (error instanceof Error) {
            // General error handling
            res
                .status(500)
                .json({ error: "Internal Server Error", details: error.message });
        }
        else {
            // Fallback for unknown error types
            res.status(500).json({ error: "Unknown Error" });
        }
    }
}));
app.post("/checkESLabelPresence", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractAddress } = req.body;
    if (!contractAddress) {
        return res.status(400).send("Bad Request: contractAddress is required");
    }
    const credId = "415873790728261632"; // Example credential ID
    const operation = "APPEND"; // Example operation
    const items = [contractAddress]; // Use the received contractAddress
    try {
        const result = yield axios_1.default.post("https://graphigo.prd.galaxy.eco/query", {
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
        }, {
            headers: {
                "access-token": process.env.GALXE_ACCESS_TOKEN_c2F6, // Use the environment variable
            },
        });
        if (result.status !== 200) {
            throw new Error(`HTTP error: ${result.status}`);
        }
        else if (result.data.errors && result.data.errors.length > 0) {
            console.log(result.data.errors);
            throw new Error("GraphQL error: " + JSON.stringify(result.data.errors));
        }
        res.status(200).json(result.data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            // Axios-specific error handling
            res.status(500).json({ error: "Axios Error", details: error.message });
        }
        else if (error instanceof Error) {
            // General error handling
            res
                .status(500)
                .json({ error: "Internal Server Error", details: error.message });
        }
        else {
            // Fallback for unknown error types
            res.status(500).json({ error: "Unknown Error" });
        }
    }
}));
//To be triggered and used exclusively by Etherscan's team
app.get("/returnExplorerTag", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.query.url;
    const elementSelector = ".hash-tag.text-truncate.lh-sm.my-n1";
    if (!url || !elementSelector) {
        return res.status(400).json({ error: "Missing url or selector parameter" });
    }
    console.log(url);
    try {
        // Fetch the web page
        const { data } = yield axios_1.default.get(url);
        // Load the HTML into cheerio
        const $ = cheerio.load(data);
        // Find and extract the contents of the specified element
        const elementContent = $(elementSelector).text().trim();
        // Return the extracted content
        res.json({ content: elementContent });
    }
    catch (error) {
        console.error("Error fetching the web page:", error);
        res.status(500).json({ error: "Error fetching the web page" });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
