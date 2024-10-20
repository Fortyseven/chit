export default {
    name: '🥩 Summarize Meeting',
    temperature: 0.2,
    prompt: `Generate a comprehensive markdown summary the following meeting transcript.

The transcript is provided in tab separated value format. The first column is the start time, the second is the end time, and the third column is the actual conversation text.

Provide the following data in markdown format using the example provided:
- a brief summary of the meeting conversation and what was discussed
- a list of the key takeaways
- a list of the topics discussed with key points for each of them
- a list of action items for things that need to be done next
- provide a comma-separated lowercase list of simple topic keywords for categorization. Make sure the keywords are relevant to the content.

Use participant names where appropriate to indicate who is responsible for what.

IMPORTANT: Do NOT include opinion, interpretations, or infer additional context where it does not exist in the provided text. Only use the information provided in the text. Do not invent information. Strive for accuracy using ONLY the information provided. This is true for the summary, or for follow-up questions asked by the user about the text: only use what is provided.

Example output:

# Brief Summary
$SUMMARY

## Topics

### Topic1
1. $TOPICDETAIL1
etc

### Topic2
1. $TOPIC2DETAIL1
etc

## Key Takeaways
1. $TAKEAWAY1
etc

## Action Items
1. $ACTIONITEM1
etc

# Topic Keywords
$keyword, $keyword, etc
`
};
