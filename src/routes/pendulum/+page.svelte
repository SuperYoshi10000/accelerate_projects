<script lang="ts">
    import {Pendulum, PendulumDisplay} from "$lib/pendulum";
    const canvas = document.getElementById("pendulum") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");


    let background = "#FFFFFF";
    let root = new Pendulum(null, false).createInstance();
    let running = false;

    function draw() {
        if (!ctx) return;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        root.pendulum.display.drawPoint(ctx, canvas.width / 2, 50);
    }

    function update(dt: number) {
        root.next(dt);
        draw();
    }
    function loop(time: number = 0) {
        if (running) {}
    }
</script>
<canvas id="pendulum" width="600" height="400"></canvas>
