// export default {
//     name: "✨ Summarize",
//     prompt: `Summarize the following text. Provide a brief summary of the text, including the main points and key details. Do not include any personal opinions or interpretations. Only use the information provided in the text. Do not invent information. Strive for accuracy using ONLY the information provided. The summary should be concise and to the point.`,
// };

export default {
    name: '✨ Summarize',
    prompt: `Summarize the following text. Provide a brief summary of the text, including the main points and key details. The summary should be concise and to the point.

After the summary, provide a short list of bullet points highlighting the overall key details.

Also note any unusual or worrying content.

Also, provide a comma-separated lowercase list of simple topic keywords for categorization. Make sure the keywords are relevant to the content.

IMPORTANT: Do NOT include opinion, interpretations, or infer additional context where it does not exist in the provided text. Only use the information provided in the text. Do not invent information. Strive for accuracy using ONLY the information provided. This is true for the summary, or for follow-up questions asked by the user about the text: only use what is provided.`
};
