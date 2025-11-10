<script lang="ts">
  import Field from "$lib/components/Field.svelte";
  import FieldList from "$lib/components/FieldList.svelte";
  import Panel from "$lib/components/Panel.svelte";
    import {PendulumSet} from "$lib/pendulum";
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let background = "#FFFFFF";
    let pendulumSet = new PendulumSet(2);
    let running = false;

    function draw() {
        if (!ctx) return;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let center = pendulumSet.position;
        pendulumSet.rootDisplay.drawPoint(ctx, center, pendulumSet.view);
    }

    function update(dt: number) {
        if (running) pendulumSet.next(dt);
        draw();
    }
    function loop(startTime: number = performance.now()) {
        let lastTime = startTime;
        function step(time: number) {
            let dt = (time - lastTime) / 1000;
            lastTime = time;
            update(dt);
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);

    }

    function load(element: HTMLCanvasElement) {
        canvas = element;
        ctx = canvas.getContext("2d")!;
        loop();
    }
</script>

<canvas id="pendulum" use:load></canvas>

<Panel top="10px" right="10px" width="420px" maxheight="calc(100% - 20px)" name="Pendulum Controls">
    <div id="debug">
        <FieldList name="Pendulums">
        <Field name="Gravity" value={pendulumSet.gravity} suffix="m/s²" />
        {#each pendulumSet.parts as part, index}
            <FieldList name="Pendulum {index + 1}">
                <Field name="Rod Length" bind:value={part.length} suffix="m" />
                <Field name="Mass" bind:value={part.mass} suffix="kg" />
                <hr>
                <Field name="Angle" bind:value={part.angle} suffix="rad" />
                <Field name="Velocity" bind:value={part.velocity} suffix="rad/s" />
                <Field name="Acceleration" bind:value={part.acceleration} readonly suffix="rad/s²" />
                <Field name="X" bind:value={part.x} readonly suffix="m" />
                <Field name="Y" bind:value={part.y} readonly suffix="m" />
            </FieldList>
        {/each}
        </FieldList>
    </div>
</Panel>

<style>
    :global(body) {
        margin: 0;
        font-family: sans-serif;
    }
    canvas {
        display: block;
        width: 100vw;
        height: 100vh;
    }
</style>