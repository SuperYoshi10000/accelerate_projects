<script lang="ts">
    import type { distance } from "$lib/csstypes";

    export let name: string = "";

    export let top: distance | null = null;
    export let bottom: distance | null = null;
    export let left: distance | null = null;
    export let right: distance | null = null;

    export let width: distance | null = null;
    export let minwidth: distance | null = null;
    export let maxwidth: distance | null = null;
    export let height: distance | null = null;
    export let minheight: distance | null = null;
    export let maxheight: distance | null = null;

</script>
<div class="panel" style="
        {top !== null ? `top: ${top};` : ''}
        {bottom !== null ? `bottom: ${bottom};` : ''}
        {left !== null ? `left: ${left};` : ''}
        {right !== null ? `right: ${right};` : ''}
        {width !== null ? `width: ${width};` : ''}
        {minwidth !== null ? `min-width: ${minwidth};` : ''}
        {maxwidth !== null ? `max-width: ${maxwidth};` : ''}
        {height !== null ? `height: ${height};` : ''}
        {minheight !== null ? `min-height: ${minheight};` : ''}
        {maxheight !== null ? `max-height: ${maxheight};` : ''}
    ">
    <nav>
        {#if name}
            <h1>{name}</h1>
        {/if}
    </nav>
    <div class="content">
        <slot></slot>
    </div>
</div>
<style>
    div.panel {
        background-color: white;
        border: 1px solid gray;
        padding: 10px;
        /* padding-top: calc(20px + 1.5em); */
        position: fixed;
        overflow: auto;
    }
    nav {
        background: inherit;
        position: sticky;
        top: 0;
        width: 100%;
    }
    h1 {
        margin: 0;
        font-size: 1.5em;
    }
</style>