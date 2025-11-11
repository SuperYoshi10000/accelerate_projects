<script lang="ts">
    export let name: string = "";
    export let updateOnChange: any = null;
</script>
<div class="field-list">
    {#if name}
        <h2>{name}</h2>
    {/if}
    <div class="fields">
        {#key updateOnChange}
            <slot></slot>
        {/key}
    </div>
</div>

<style>
    div.field-list {
        border: 1px solid gray;
        padding: 5px;
    }
    div.fields {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    h2 {
        margin: 0;
        font-size: 1.2em;
    }
</style>