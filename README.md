# 🏷️ AutoTagger Plugin for Obsidian

AutoTagger is an Obsidian plugin that automatically generates relevant tags for your active note using an AI model hosted on [ai.alexalex.net](https://ai.alexalex.net). It inserts the tags into your note's frontmatter, helping you keep your vault organized effortlessly.

---

## ✨ Features

- 🔍 Extracts 5–7 context-aware tags from any note  
- 🧠 Uses the `mistral` model through a custom Ollama-compatible API  
- ⚡ Adds or updates the `tags:` field in the frontmatter  
- 🔔 Notifies you of success or errors using Obsidian's built-in notice system

---

## 🚀 Usage

1. Open a note in Obsidian  
2. Run the command palette (`Ctrl+P` / `Cmd+P`)  
3. Search for: `Auto-tag current note`  
4. Let the AI suggest relevant tags and update the frontmatter

---

## ⚙️ Installation

**Manual Installation:**

1. Clone or download this repository  
2. Place `main.js` and `manifest.json` into a folder inside your Obsidian `.obsidian/plugins` directory (e.g., `.obsidian/plugins/AutoTagger`)  
3. Enable the plugin from Obsidian's **Community Plugins** section

---

## 🛠️ API Details

The plugin makes a `POST` request to: https://ai.alexalex.net/api/generate


with a payload like:

```json
{
  "model": "mistral",
  "prompt": "Extract 5-7 relevant tags for this note. Respond only with comma-separated tags.\n\n<your-note-content>"
}
```

It expects a streamed JSON response with a `response` field containing the tags as comma-separated values.

---

## 🧑‍💻 Author

Made by [Alexander Dial](https://alexalex.net)


