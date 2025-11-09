export interface Vector2 {
    x: number;
    y: number;
}
export interface PendulumState extends Vector2 {
    angle: number;
    time: number;
}

export class PendulumPart implements Vector2 {
    length: number = 1;
    mass: number = 1;
    
    startAngle: number = 90;
    startX: number  = 0;
    startY: number = -1;

    angle: number = 90;
    x: number = 0;
    y: number = -1;

    velocity: number = 0;

    display: PendulumDisplay = new PendulumDisplay();
    
    previousPositions: PendulumState[] = [];

    next(dt: number) {}



    draw(ctx: CanvasRenderingContext2D, time: number, parentPos: Vector2) {
        const drawFadeTime = this.display.drawFadeTime || 0;
        
        // Remove old positions
        while (drawFadeTime >= 0 && this.previousPositions[0].time < time - drawFadeTime) {
            this.previousPositions.shift();
        }

        // Previous positions
        for (const pos of this.previousPositions) {
            const alpha = drawFadeTime > 0 ? 1 - (time - pos.time) / drawFadeTime : 1;
            ctx.strokeStyle = this.display.drawColor || "black";
            ctx.lineWidth = this.display.drawWidth || 1;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;        

        this.display.drawPoint(ctx, this.x, this.y); // Ball
        this.display.drawLine(ctx, parentPos.x, parentPos.y, this.x, this.y); // Rod
    }

}


export class Pendulum {
    gravity: number = 9.81;
    position: Vector2 = { x: 0, y: 0 };
    rootDisplay: PendulumDisplay = new PendulumDisplay();
    parts: PendulumPart[] = [];

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
    borderFirst?: boolean;
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
    borderFirst: boolean;
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
        this.borderFirst = options.borderFirst || false;
        this.lineColor = options.lineColor || "black";
        this.lineWidth = options.lineWidth || 1;
        this.drawColor = options.drawColor || "black";
        this.drawWidth = options.drawWidth || 1;
        this.drawFadeTime = options.drawFadeTime || 0;
    }

    drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        const radius = this.size / 2;
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
        if (this.borderFirst) {
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.fill();
            ctx.stroke();
        }
    }
}