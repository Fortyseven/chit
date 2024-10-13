<script>
    import {
        pendingContinuedAssistantChat,
        pendingResponse,
        responseInProgress,
        wasAborted
    } from '$lib/api/api';
    import { ollama } from '$lib/api/ollama';
    import { dispatchToEventBus } from '$lib/events';
    import { chatState, completedResponse } from '$stores/chatState';
    import { chatTimeline, errorMessage } from '$stores/stores';
    import { systemPromptTemplated } from '$stores/templates';
    import { getContext } from 'svelte';

    /* ----------------------------------------------------------*/

    // /**
    //  * Append the response fragment to the pending response.
    //  * @param response_fragment
    //  */
    // function _updatePendingResponse(response_fragment) {
    // }

    /* ----------------------------------------------------------*/

    /**
     * Clear the pending response.
     */
    function _clearPendingResponse() {
        $pendingResponse = {
            role: 'assistant',
            content: ''
        };
    }

    /* ----------------------------------------------------------*/

    function _getChatParamObject() {
        const chat_parameters = $chatState.values;

        //FIXME:
        delete chat_parameters.stop;

        let new_chat_parameters = {};

        for (const key of Object.keys(chat_parameters)) {
            if (
                chat_parameters[key] !== undefined &&
                chat_parameters[key] != -1
            ) {
                try {
                    new_chat_parameters[key] = parseFloat(chat_parameters[key]);
                } catch (e) {
                    new_chat_parameters[key] = chat_parameters[key];
                }
            }
        }

        return new_chat_parameters;
    }

    /* ----------------------------------------------------------*/

    async function runInference({
        user_message = null,
        continue_chat = false,
        pasted_image = undefined
    }) {
        if (!$chatState?.model_name) {
            throw new Error('No model selected');
        }

        let should_continue_assistant_chat = false;

        if (continue_chat) {
            // was last chat message's role an 'assistant' type?
            const last_message_role =
                $chatTimeline[$chatTimeline.length - 1].role;

            if (last_message_role === 'assistant') {
                should_continue_assistant_chat = true;
                $pendingContinuedAssistantChat = true;
            } else {
                // throw new Error(
                //     "Can't continue chat: last message was not from assistant."
                // );
                // return;
            }
        }

        // if we don't have a message, it's for use when there's already
        // a user message in the timeline, so skip adding it again
        if (user_message !== null && !should_continue_assistant_chat) {
            const msg_packet = {
                role: 'user',
                content: user_message,
                images: []
            };

            if (pasted_image) {
                let img64 = await convertBlobUrlToBase64(pasted_image);
                msg_packet.images.push(img64);
            }

            chatTimeline.update((timeline) => {
                timeline.push(JSON.parse(JSON.stringify(msg_packet)));
                return timeline;
            });
        }

        try {
            // sets the pending message index to expect for the response

            const body = {
                // model: $chatState.model_name,
                stream: true,
                messages: [...$chatTimeline],
                //format: 'json',
                options: {
                    ..._getChatParamObject()
                    // stop: ['[INST]', '[/INST]', '<<SYS>>', '<</SYS>>']
                    // TODO: let's get this into the preset manager
                }
            };

            const sys_prompt =
                $chatState?.system_prompt && $systemPromptTemplated;

            if (sys_prompt) {
                body.messages = [
                    {
                        role: 'system',
                        content: sys_prompt
                    },
                    ...body.messages
                ];
            }

            _clearPendingResponse();
            $wasAborted = false;

            console.log('runInference REQUEST body: ', body);

            try {
                $responseInProgress = true;

                let stream = await ollama().chat({
                    stream: true,
                    model: $chatState.model_name,
                    messages: body.messages,
                    options: body.options
                });

                if (stream.status >= 300) {
                    console.error('Error connecting to server: ' + stream.body);
                    $errorMessage = stream.statusText;
                    return;
                }

                for await (const chunk of stream) {
                    $pendingResponse.content += chunk.message.content;
                }

                // we're going to sneak back in the original image since the
                // one we sent to the server was base64 encoded, etc. This way
                // we can keep the original image for restoration onBack
                if (pasted_image) {
                    chatTimeline.update((timeline) => {
                        const last_message = timeline.pop();

                        if (last_message) {
                            // we're saving the original blob for reference
                            // in case the user goes 'back'
                            last_message.image_blob = pasted_image;

                            timeline.push(last_message);

                            return timeline;
                        }
                    });
                }
            } catch (err) {
                console.log('🛑🛑🛑 runInference error: ', err);

                if (err.name === 'AbortError') {
                    console.log('runInference aborted');
                    $wasAborted = true;
                    return;
                }
            } finally {
                $responseInProgress = false;
            }

            let pending = $pendingResponse;

            if ($chatState.values.num_predict > -1) {
                // strip incomplete sentence from end of last message if we're restricting
                // the number of tokens returned
                pending.content = stripIncompleteSentence(pending.content);
            }

            $completedResponse = pending;
        } catch (err) {
            if (err.name !== 'AbortError') {
                throw Error('Error connecting to server: ' + err.message);
            } else {
                return null;
            }
        } finally {
            dispatchToEventBus('onResponseComplete');
        }
    }

    /* ----------------------------------------------------------*/

    getContext('event-bus').subscribe(async (ev) => {
        if (ev) {
            switch (ev.name) {
                case 'runInference':
                    await runInference(ev.data);
                    break;
            }
        }
    });
</script>

<div id="API" class="h-full">
    <slot />
</div>
