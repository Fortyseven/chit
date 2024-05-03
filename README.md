# Chit

![](/docs/screenshot.png?raw=true)

Chit is a light, serverless chat front-end for Ollama that doesn't rely on a server backend. Everything happens in the browser, other than connecting to the Ollama API.

# Features

-   Runs entirely in the browser.

-   No backend necessary, only an [Ollama](https://ollama.com/) API endpoint. Nothing else.

-   Easy access to the current model, system prompt and inference values.

-   Quick saving and loading of JSON-format presets locally, preserving the system prompt, inference settings, and model for easy retrieval.

    -   Compatible with KoboldCpp presets, at least on import. Saving is supported, but not guaranteed to be backwards compatible. Try it!

-   Basic variable expansion for system prompts (e.g. `{{myvariable}}` -> `My Text`, and `{{date}}` expands to the current date/time of inference.

-   Markdown rendering if it's detected in the response (code blocks, etc), or just uses it all the time if configured.

-   Reroll responses, copy responses to clipboard, etc.

-   Implements image pasting from the clipboard for inference against multimodal models.

-   Optional audio response when inference is complete.

-   Responses are streamed in real time.

-   Everything is persisted through your browser's localStorage, or through JSON exports.

# Use it

There's a [hosted copy here on GitHub](https://fortyseven.github.io/chit/) with the latest build. You can use this as much as you like (it defaults to the default localhost Ollama endpoint), but feel free to build and host it yourself. 🍻 - Just beware that since it's the latest build, it may include new bugs. But it also might include new features. _Live life on the edge._

# Planned Features

Chit is a personal project that is constantly being worked on; while code contributions are not currently being accepted, and I can't guarantee I'll do any of it, ideas and feature suggestions are welcome.

-   Save and reload conversations.

-   Upload images for inference (depending on the model).

-   Mobile view

-   More?

# Known Issues

-   Bugs abound, but it's been fairly solid for me the last couple weeks. 👌
