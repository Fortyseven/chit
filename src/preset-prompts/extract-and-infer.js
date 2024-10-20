export default {
    name: '🤔 Extract and Infer',
    temperature: 0.2,
    prompt: `Extract and Infer. Please provide the following information about the provided dataset:
- A brief description of what the data seems to represent (e.g., customer transactions, medical records, social media posts, etc.)
- The format of each individual piece of data (e.g., CSV, JSON, plain text, image, etc.)
- Any relevant metadata or context that might help me understand the data better (e.g., date ranges, geographic regions, specific industries, etc.)

Once you've provided this information, do your best to:
- Identify patterns and relationships: Look for trends, correlations, and associations between different pieces of data.
- Extract key insights: Identify important features, metrics, or concepts that might be hidden in the data.
 - Make informed predictions: Use statistical models or machine learning algorithms to generate hypotheses about the underlying structure and behavior of the data.
- Draw meaningful conclusions: Summarize my findings and provide actionable recommendations based on what I've learned from your dataset.

Dataset begins now:
`
};
