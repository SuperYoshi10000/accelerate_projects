<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Field from "$lib/components/Field.svelte";
    import FieldList from "$lib/components/FieldList.svelte";
    import Panel from "$lib/components/Panel.svelte";
    import {PendulumSet, View} from "$lib/pendulum";
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let canvasWidth = 800;
    let canvasHeight = 600;

    let view = new View();
    let background = "#FFFFFF";
    let pendulumSet = new PendulumSet(2, view);
    let running = false;

    function draw() {
        if (!ctx) return;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let center = pendulumSet.position;
        pendulumSet.rootDisplay.drawPoint(ctx, center, pendulumSet.view);
        for (let [index, part] of pendulumSet.parts.entries()) {
            part.draw(ctx, performance.now(), index === 0 ? center : pendulumSet.parts[index - 1], pendulumSet.view);
        }
    }

    function update(dt: number, stepMode: boolean = false) {
        if (running || stepMode) pendulumSet.next(dt);
        draw();
        // console.log(pendulumSet);
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
        view.x = canvasWidth / 200;
        view.y = canvasHeight / 200;
        loop();
    }
</script>

<canvas id="pendulum" width={canvasWidth} height={canvasHeight} use:load></canvas>

<Panel top="10px" right="10px" width="420px" maxheight="calc(100% - 20px)" name="Pendulum Controls">
    <div id="debug">
        <FieldList name="Pendulums">
        <Field name="Gravity" value={pendulumSet.gravity} suffix="m/s²" />
        {#each pendulumSet.parts as part, index}
            <FieldList name="Pendulum {index + 1}">
                <Field name="Rod Length" type="number" bind:value={part.length} suffix="m" />
                <Field name="Mass" type="number" bind:value={part.mass} suffix="kg" />
                <hr>
                <Field name="Angle" type="number" bind:value={part.angle} suffix="rad" />
                <Field name="Velocity" type="number" bind:value={part.velocity} suffix="rad/s" />
                <Field name="Acceleration" type="number" bind:value={part.acceleration} readonly suffix="rad/s²" />
                <Field name="X" type="number" bind:value={part.x} readonly suffix="m" />
                <Field name="Y" type="number" bind:value={part.y} readonly suffix="m" />
            </FieldList>
        {/each}
        </FieldList>
    </div>
</Panel>
<Button action={() => running = !running}>{running ? "Pause" : "Start"}</Button>
<Button action={() => update(1/60, true)}>Step</Button>

<style>
    :global(body) {
        margin: 0;
        font-family: sans-serif;
    }
    canvas {
        display: block;
        width: 800px;
        height: 600px;
    }
</style>