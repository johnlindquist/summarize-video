#!/usr/bin/env bun
/**
 * Summarize a video with Gemini 2.5 Pro.
 * Usage: summarize-video <path/to/file.mp4> [--prompt <path/to/prompt.txt>]
 *
 * 1.  Requires a GEMINI_API_KEY env var
 * 2.  `bun add @google/genai`
 * 3.  Run: `bun run summarize-video.ts path/to/video.mp4`
 */

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import * as p from "node:path";
import {
    GoogleGenAI,
    createUserContent,
    createPartFromUri,
} from "@google/genai";

async function main() {
    // --- 0.  CLI parsing ------------------------------------------------------
    const [, , filePath, ...extra] = process.argv;
    const promptIdx = extra.findIndex((f) => f === "--prompt");
    const promptPath =
        promptIdx >= 0 && extra[promptIdx + 1]
            ? extra[promptIdx + 1]
            : undefined;

    if (!filePath || !filePath.endsWith(".mp4") || !existsSync(filePath)) {
        console.error(
            "Usage: summarize-video <path/to/file.mp4> [--prompt prompt.txt]"
        );
        process.exit(1);
    }

    // --- 1.  Gemini client ----------------------------------------------------
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set in the environment");
        process.exit(1);
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // --- 2.  Upload the video -------------------------------------------------
    console.log("Uploading video …");
    let file = await ai.files.upload({
        file: filePath,
        config: { mimeType: "video/mp4" },
    });

    if (!file.uri) {
        throw new Error("No file.uri or file.name from Gemini", { cause: file });
    }

    if (!file.name) {
        throw new Error("No file.name from Gemini", { cause: file });
    }

    // Poll until the file becomes ACTIVE (max ~2 min)
    let attempts = 0;
    const maxAttempts = 60;
    while (file.state !== "ACTIVE" && attempts < maxAttempts) {
        await Bun.sleep(2_000);
        file = await ai.files.get({ name: file.name! });
        console.log(`↻  Status check ${++attempts}/${maxAttempts}: ${file.state}`);
        if (file.state === "FAILED") {
            throw new Error(`File processing failed: ${file.error?.message ?? ""}`);
        }
    }
    if (file.state !== "ACTIVE") {
        throw new Error("File did not become ACTIVE in time – aborting.");
    }
    console.log("✅  File ready!");

    // --- 3.  Load prompt template --------------------------------------------
    const defaultPrompt = `Summarize this video in markdown bullet points. 
Include timestamps (MM:SS) and a TL;DR.`;
    const prompt =
        promptPath && existsSync(promptPath)
            ? await readFile(promptPath, "utf8")
            : defaultPrompt;

    // --- 4.  Generate the summary --------------------------------------------
    console.log("Asking Gemini …");
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: createUserContent([
            createPartFromUri(file.uri!, file.mimeType!),
            prompt,
        ]),
    });
    if (!response.text) {
        throw new Error("No response.text from Gemini", { cause: response });
    }

    // --- 5.  Persist the markdown next to the video ---------------------------
    const outPath = p.join(
        p.dirname(filePath),
        `${p.parse(filePath).name}.md`
    );
    await writeFile(outPath, response.text);
    console.log(`✨  Summary written to ${outPath}`);
}

main().catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
}); 