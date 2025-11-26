<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Field from "$lib/components/Field.svelte";
    import FieldList from "$lib/components/FieldList.svelte";
    import Panel from "$lib/components/Panel.svelte";
    import Spacer from "$lib/components/Spacer.svelte";
    import { Body, BodyDisplay, GravitySimulation, View } from "$lib/gravity";

    const DEFAULT_BODY_COUNT = 3;
    const DEBUG = false;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let canvasWidth = 800;
    let canvasHeight = 600;

    let view = new View();
    let background = "black";
    let gravitySimulation: GravitySimulation;
    let running = false;

    let controls: Panel;

    let frame = 0; // Used to update display

    let drawVelocity = false;

    function draw() {
        if (!ctx) return;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        gravitySimulation.bodies.forEach(body => {
            body.display.drawPoint(ctx, body, view);
        });
    }

    function update(dt: number, stepMode?: boolean) {
        if (stepMode !== false && (running || stepMode)) {
            frame++;
            gravitySimulation.updateBodies(dt);
        }
        draw();

        if (DEBUG) debug_drawFrame();
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
        view.x = 0;
        view.y = 0;
        gravitySimulation = new GravitySimulation(view, DEFAULT_BODY_COUNT, canvas);
        loop();
    }
    function reset() {
        update(0, false);
        gravitySimulation = new GravitySimulation(view, DEFAULT_BODY_COUNT, canvas);
    }

    function debug_drawFrame() {
        const display = BodyDisplay.createRandom({size: 5, color: 'white', borderWidth: 0});
        for (let i = 0; i <= 100; i++) {
            display.drawPoint(ctx, {x: i * (canvas.width / 100 / view.scale), y: 0}, view);
            display.drawPoint(ctx, {x: i * (canvas.width / 100 / view.scale), y: (canvas.height / view.scale)}, view);
        }
        for (let j = 0; j <= 100; j++) {
            display.drawPoint(ctx, {x: 0, y: j * (canvas.height / 100 / view.scale)}, view);
            display.drawPoint(ctx, {x: (canvas.width / view.scale), y: j * (canvas.height / 100 / view.scale)}, view);
        }
    }
</script>

<canvas id="pendulum" width={canvasWidth} height={canvasHeight} use:load></canvas>

<Panel bind:this={controls} top="10px" right="10px" width="420px" maxheight="calc(100% - 20px)" name="Controls">
    <div id="debug">
        <Spacer height="10px" newline />
        <Field name="Gravitational Constant" type="number" value={GravitySimulation.GRAVITATIONAL_CONSTANT} readonly suffix="N·m²/kg²" />
        <Spacer height="10px" newline />
        <FieldList name="Bodies" bind:updateOnChange={frame}>
        {#each gravitySimulation?.bodies || [] as body, index}
            <FieldList name="Body {index + 1}" id={index}>
                <Field name="Size" type="number" bind:value={body.display.size} suffix="px" />
                <Field name="Mass" type="number" bind:value={body.mass} suffix="kg" />
                <Field name="X Velocity" type="number" bind:value={body.velocity.x} suffix="m/s" />
                <Field name="Y Velocity" type="number" bind:value={body.velocity.y} suffix="m/s" />
                <Field name="X" type="number" bind:value={body.x} suffix="m" />
                <Field name="Y" type="number" bind:value={body.y} suffix="m" />
                <hr>
                <Button action={() => {gravitySimulation!.bodies.splice(index, 1); frame++}} width="130px" bgcolor="lightcoral">Remove Body</Button>
            </FieldList>
        {/each}
        </FieldList>
        <Spacer height="10px" newline />
        <Button action={() => {gravitySimulation!.bodies.push(Body.createRandom(canvas, view)); frame++}} width="150px" bgcolor="lightgreen">Add Body</Button>
    </div>
</Panel>

<Button action={() => running = !running} width="100px">{running ? "Pause" : "Start"}</Button>
<Button action={() => update(1/60, true)} width="100px">Step</Button>
<Button action={reset} width="100px">Reset</Button>

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