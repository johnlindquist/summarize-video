# summarize-video

Summarize any `.mp4` video using Gemini 2.5 Pro, right from your terminal. Get a markdown summary with timestamps and a TL;DR in seconds.

---

## Features
- Uploads your video to Gemini 2.5 Pro
- Summarizes with markdown bullet points and timestamps
- Optional custom prompt via `--prompt`
- Outputs `.md` file next to your video
- Bun-native CLI, zero install for users

---

## Prerequisites

| Tool                  | Install command                                               |
| --------------------- | ------------------------------------------------------------- |
| **Bun 1.2 +**         | `curl -fsSL https://bun.sh/install | bash`                    |
| **Google Gen AI key** | Grab one in AI Studio (https://aistudio.google.com/apikey) → `export GEMINI_API_KEY="…"`           |

---

## Quick Start

```bash
git clone https://github.com/you/video-summarizer.git
cd video-summarizer
bun install
```

### Global install (recommended)

To make the CLI available everywhere, use:
```bash
bun link
```
This registers the package globally and makes the `summarize-video` command available from anywhere.

> **Note:** `bun add --global .` has known issues with lockfile resolution for local packages. Use `bun link` instead.

---

### Build a standalone binary for your platform

#### On Linux
```bash
bun run build:unix
./summarize-video <path/to/video.mp4>
```

#### On macOS (Intel/x64)
```bash
bun run build:mac
./summarize-video-mac <path/to/video.mp4>
```

#### On macOS (Apple Silicon/ARM64)
```bash
bun run build:mac-arm
./summarize-video-mac-arm <path/to/video.mp4>
```

#### On Windows
```powershell
bun run build:win
./summarize-video.exe <path\to\video.mp4>
```

> **Note:**
> - Bun's build system automatically makes the binary executable for your platform.
> - The `bin` field in `package.json` points to `index.ts` for package manager installs (e.g., `bunx summarize-video`).
> - For standalone binaries, use the appropriate build script for your OS and run the resulting binary directly.
> - For global CLI installs, use `bun link` from your project root.

---

## Usage

```bash
summarize-video <path/to/file.mp4> [--prompt <path/to/prompt.txt>]
```

- The script uploads the file, polls until Gemini finishes processing, and spits out `my-demo.md` next to the original video.
- No `.mp4`? The CLI bails out with a grumpy—but polite—error message.

---

## How it works

1. **Upload**: Sends your video to Gemini
2. **Poll**: Waits for Gemini to process the file
3. **Prompt**: Uses a default or custom prompt
4. **Summarize**: Gets markdown summary
5. **Output**: Writes `.md` file next to your video

---


## License
MIT 