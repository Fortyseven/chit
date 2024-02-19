<script>
    let inputEl = undefined;

    function onKeyPress(ev) {
        if (ev.key === 'Enter') {
            console.log('Enter pressed');
            inputEl.value = '';
        }
    }
</script>

<input
    class="has-text-primary has-background-dark"
    type="text"
    placeholder="Type a message..."
    bind:this={inputEl}
    on:keypress={onKeyPress}
/>

<style lang="scss">
    input {
        width: 100%;
        padding: 1em;
        border: none;
    }
</style>
