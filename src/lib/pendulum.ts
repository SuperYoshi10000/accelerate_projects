export interface Vector2 {
    x: number;
    y: number;
}
export interface PendulumState extends Vector2 {
    angle: number;
    time: number;
}

export class PendulumPart {
    length: number;
    mass: number;
    startAngle: number;
    display: PendulumDisplay;
    angle: number;
    velocity: Vector2;
    
    previousPositions: PendulumState[] = [];

    draw(ctx: CanvasRenderingContext2D, time: number) {
        const drawFadeTime = this.display.drawFadeTime || 0;
        while (drawFadeTime >= 0 && this.previousPositions[0].time < time - drawFadeTime) {
            this.previousPositions.shift();
        }
        for (const pos of this.previousPositions) {
            const alpha = drawFadeTime > 0 ? 1 - (time - pos.time) / drawFadeTime : 1;
            ctx.strokeStyle = this.display.drawColor || "black";
            ctx.lineWidth = this.display.drawWidth || 1;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    }

}


export class Pendulum {
    gravity: number;
    position: PendulumState;
    rootDisplay: PendulumDisplay;
    first: PendulumPart;
    second: PendulumPart;

    constructor() {}

    next(dt: number) {
        this.angle += this.angularVelocity * dt;
        // I have no idea how pendulums work so I'll do this later
    }

}


export interface PendulumDisplayOptions {
    color?: string;
    size?: number;
    borderColor?: string;
    borderWidth?: number;
    lineColor?: string;
    lineWidth?: number;
    drawColor?: string;
    drawWidth?: number;
    drawFadeTime?: number;
}
export class PendulumDisplay {
    color: string;
    size: number;
    borderColor: string;
    borderWidth: number;
    lineColor: string;
    lineWidth: number;
    drawColor: string;
    drawWidth: number;
    drawFadeTime: number;

    constructor(options: PendulumDisplayOptions = {}) {
        this.color = options.color || "black";
        this.size = options.size || 10;
        this.borderColor = options.borderColor || "black";
        this.borderWidth = options.borderWidth || 1;
        this.lineColor = options.lineColor || "black";
        this.lineWidth = options.lineWidth || 1;
        this.drawColor = options.drawColor || "black";
        this.drawWidth = options.drawWidth || 1;
        this.drawFadeTime = options.drawFadeTime || 0;
    }

    drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.beginPath();
        ctx.ellipse(x, y, this.size / 2, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}