# summarize-video

> **Stop Scrubbing, Start Summarizing – a 5‑Minute Bun CLI for Video TL;DRs**

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
| **Google Gen AI key** | Grab one in AI Studio → `export GEMINI_API_KEY="…"`           |
| **FFmpeg (optional)** | If you need to trim or transcode before upload                |

---

## Quick Start

```bash
git clone https://github.com/you/video-summarizer.git
cd video-summarizer
bun install
```

### Make it global (two choices)

- **Symlink way**: `bun link -g` – quickest, perfect for dev boxes
- **Binary way**: `bun build summarize-video.ts --compile --outfile summarize-video && mv summarize-video ~/.bun/bin` – zero external deps for your students

Either path gives you a shiny `summarize-video` command discoverable from anywhere.

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

## FAQ

- **How big is the binary?** ~7–8 MB on macOS arm64 (stripped)
- **Can I switch models?** Yup – change the `model` field in the script
- **Where’s the prompt?** Either inline (default) or via `--prompt my.txt`

---

## Next steps / ideas

- Add subtitle extraction (VTT) for higher accuracy
- Batch mode: summarize a folder overnight
- Publish: `bun publish` to npm for `bunx summarize-video`

---

## License
MIT 