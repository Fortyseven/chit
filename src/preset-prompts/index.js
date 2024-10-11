import analysis from './analysis.js';
import translate from './translate.js';
import sdprompt from './sdprompt.js';
import general from './general.js';
import summarize from './summarize.js';
import extract_and_infer from './extract-and-infer.js';
import retort from './retort.js';
import eli5 from './eli5.js';
import summary_meeting from './summary-meeting.js';

const SYSTEM_PROMPTS = {
    general,
    summarize,
    summary_meeting,
    eli5,
    translate,
    sdprompt,
    analysis,
    extract_and_infer,
    retort
};

export default SYSTEM_PROMPTS;
