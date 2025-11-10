<script lang="ts">
    export let action: ((event: MouseEvent) => void) | null = null;
</script>

<button on:click={action}>
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