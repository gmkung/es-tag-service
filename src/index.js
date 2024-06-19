"use strict";
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
