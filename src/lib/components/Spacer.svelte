<script lang="ts">
    import type { distance } from "$lib/csstypes";

    export let width: distance | null = null;
    export let height: distance | null = null;
    export let newline: boolean = false;
</script>

<div class="spacer" style="
        {width !== null ? `width: ${width};` : ''}
        {height !== null ? `height: ${height};` : ''}
        display: {newline ? 'block' : 'inline-block'};
"></div>