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
const cheerio = __importStar(require("cheerio"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const allowedOrigins = ["https://script.google.com"];
const corsOptions = {
    origin: function (origin, callback) {
        // Check if the origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1) { //|| !origin 
            console.log('Origin ok');
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
//To be triggered and used exclusively by Etherscan's team
app.get("/returnExplorerTag", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.query.url;
    const elementSelector = ".hash-tag.text-truncate.lh-sm.my-n1";
    if (!url || !elementSelector) {
        return res.status(400).json({ error: "Missing url or selector parameter" });
    }
    try {
        // Fetch the web page
        const { data } = yield axios_1.default.get(url);
        // Load the HTML into cheerio
        const $ = cheerio.load(data);
        // Find and extract the contents of the specified element
        const elementContent = $(elementSelector).text().trim();
        // Return the extracted content
        res.json({ tag: elementContent });
    }
    catch (error) {
        console.error("Error fetching the web page:", error);
        res.status(500).json({ error: "Error fetching the web page" });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
