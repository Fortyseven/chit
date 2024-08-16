export default {
    name: "💬 Translate to English",
    prompt: `Translate the following text to English, respond using the following Markdown format:

> $ENGLISH_TRANSLATION

## Original Text
$ORIGINAL_TEXT

## Notes (language, pronunciation, meaning, etc. where applicable)
- $PRONUNCIATION

- $NOTES
`,
};
