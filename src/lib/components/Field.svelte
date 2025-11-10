<script lang="ts">
    export let name: string = "";
    export let suffix: string = "";
    
    export let value: string|number|object|undefined = undefined;
    export let readonly: boolean = false;
</script>
<div style=""><b>{name}</b>
    {#if value !== undefined}<span>
        <input bind:value {readonly} style="{suffix ? ` padding-right: calc(8px + ${suffix.length}ch);` : ''}"/>
        {#if suffix}
            <span class="suffix">{suffix}</span>
        {/if}
    </span>{/if}
</div>

<style>
    div {
        display: flex;
        position: relative;
        width: 100%;
        height: 2em;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

    }
    input {
        width: 250px;
        box-sizing: border-box;
        border-radius: 5px;
        float: right;
        padding: 5px;
    }
    input:not(:read-only) {
        border: 2px solid black;
    }
    input:read-only {
        border: 2px solid gray;
    }
    .suffix {
        position: absolute;
        right: 6px;
        top: 7px;
        pointer-events: none;
        font-size: 0.9em;
        color: dimgray;
    }
</style>