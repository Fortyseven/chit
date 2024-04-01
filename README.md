# Chit

![](/docs/screenshot.png?raw=true)

Chit is a light, serverless chat front-end for Ollama that doesn't rely on a server backend. Everything happens in the browser, other than connecting to the Ollama API.

# Features

-   No backend necessary, only an [Ollama](https://ollama.com/) API endpoint.

-   Easy access to the current model, system prompt and inference values.

-   Quick saving and loading of presets, preserving system prompt and other config values for easy retrieval.
    -   Compatible with KoboldCpp presets.

# Use it

Here's a [hosted copy here on GitHub](https://fortyseven.github.io/chit/) with the latest build, but feel free to build and host it yourself. 🍻

# Planned Features

Chit is a personal project that is constantly being worked on; while code contributions are not currently being accepted, and I can't guarantee I'll do any of it, ideas and feature suggestions are welcome.

-   Save and reload conversations.

-   Upload images for inference (depending on the model).

-   Mobile view

-   More?

# Known Issues

-   There's some sketchy behavior around the conversation that can cause it to get confused sometimes. This part needs a more solid rewrite. While it works okay most of the time, don't trust it for long-term chatting.

-   Error reporting was sorely neglected.
