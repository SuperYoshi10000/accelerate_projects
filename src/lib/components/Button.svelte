<script lang="ts">
    import type { distance } from "$lib/csstypes";

    export let action: ((event: MouseEvent) => void) | null = null;

    export let width: distance | null = null;
    export let height: distance | null = null;
</script>

<button
    style="
        {width !== null ? `width: ${width};` : ''}
        {height !== null ? `height: ${height};` : ''}
    " 
    on:click={action}
>
    <slot></slot>
</button>

<style>
    button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background: deepskyblue;
        color: white;
        font-weight: bold;
        cursor: pointer;
    }
</style>