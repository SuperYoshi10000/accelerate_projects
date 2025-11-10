export interface Vector2 {
    x: number;
    y: number;
}
export interface PendulumState extends Vector2 {
    angle: number;
    time: number;
}

export class View implements Vector2 {
    x: number = 0;
    y: number = 0;
    scale: number = 100;
    constructor() {}

    calcPosXY(pos: Vector2): [number, number] {
        return [
            (this.x - pos.x) * this.scale,
            (this.y - pos.y) * this.scale // Negative because canvas y increases when going down
        ];
    }
}

export class PendulumPart implements Vector2 {
    static readonly DEFAULT_ANGLE = Math.PI / 2;

    length: number = 1;
    mass: number = 1;
    
    startAngle: number = PendulumPart.DEFAULT_ANGLE;
    startX: number  = 0;
    startY: number = -1;

    angle: number = PendulumPart.DEFAULT_ANGLE;
    x: number = 0;
    y: number = -1;

    velocity: number = 0;
    acceleration: number = 0;
    
    // Rendering
    display: PendulumDisplay = new PendulumDisplay();
    previousPositions: PendulumState[] = [];

    next(dt: number, acceleration: number, parentPos?: Vector2) {
        this.acceleration = acceleration;
        this.velocity += acceleration * dt;
        this.angle += this.velocity * dt;

        this.x = this.length * Math.sin(this.angle) + (parentPos?.x ?? 0);
        this.y = -(this.length * Math.cos(this.angle) + (parentPos?.y ?? 0));
    }

    draw(ctx: CanvasRenderingContext2D, time: number, parentPos: Vector2, view: View) {
        const drawFadeTime = this.display.drawFadeTime || 0;
        
        // Remove old positions
        while (drawFadeTime >= 0 && this.previousPositions[0]?.time < time - drawFadeTime) {
            this.previousPositions.shift();
        }

        // Previous positions
        for (const pos of this.previousPositions) {
            // console.log(pos);
            const alpha = drawFadeTime > 0 ? 1 - (time - pos.time) / drawFadeTime : 1;
            ctx.strokeStyle = this.display.drawColor || "black";
            ctx.lineWidth = this.display.drawWidth || 1;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;        

        this.display.drawPoint(ctx, this, view); // Bob
        this.display.drawLine(ctx, parentPos, this, view); // Rod
    }

}


export class PendulumSet {
    gravity: number = 9.80665;
    position: Vector2 = { x: 0, y: 0 };
    view: View;
    rootDisplay: PendulumDisplay = new PendulumDisplay();
    parts: PendulumPart[];
    readonly count: number;

    constructor(count: "single" | "double" | number = "double", view?: View) {
        if (count === "single") this.count = 1;
        else if (count === "double") this.count = 2;
        else this.count = count;
        this.parts = Array.from({length: this.count}, (v, k) => new PendulumPart());
        this.view = view ?? new View();
    }

    next(dt: number) {
        console.log(this);
        if (this.count === 1) {}
        if (this.count === 2) {
            // Note: t (theta) = angle (because a is used for acceleration)

            const t1 = this.parts[0].angle;
            const m1 = this.parts[0].mass;
            const l1 = this.parts[0].length;
            const v1sq = this.parts[0].velocity ** 2;
            const sin1 = Math.sin(t1);

            const t2 = this.parts[1].angle;
            const m2 = this.parts[1].mass;
            const l2 = this.parts[1].length;
            const v2sq = this.parts[1].velocity ** 2;
            const sin2 = Math.sin(t2);
            

            const delta = t2 - t1;
            const sind = Math.sin(delta);
            const cosd = Math.cos(delta);
            const sincosd = sind * cosd;
            
            const massSum = m1 + m2;
            const massTimesGravity = massSum * this.gravity;
            
            const d1 = massSum * l1 - m2 * l1 * (cosd ** 2);
            const d2 = (l2 / l1) * d1;

            const a1 = (
                m2 * l1 * v1sq * sincosd
                + m2 * this.gravity * sin2 * cosd
                + m2 * l2 * v2sq * sind
                - massTimesGravity * sin1
            ) / d1;
            const a2 = (
                -m2 * l2 * v2sq * sincosd
                + massTimesGravity * sin1 * cosd
                - massSum * l1 * v1sq * sind
                - massTimesGravity * sin2
            ) / d2;
            
            this.parts[0].next(dt, a1);
            this.parts[1].next(dt, a2);
        }
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

    drawLine(ctx: CanvasRenderingContext2D, parentPos: Vector2, pos: Vector2, view: View) {
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(...view.calcPosXY(parentPos));
        ctx.lineTo(...view.calcPosXY(pos));
        ctx.stroke();
    }

    drawPoint(ctx: CanvasRenderingContext2D, pos: Vector2, view: View) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        const radius = this.size / 2;
        ctx.beginPath();
        ctx.ellipse(...view.calcPosXY(pos), radius, radius, 0, 0, Math.PI * 2);
        if (this.borderFirst) {
            ctx.stroke();
            ctx.fill();
        } else {
            ctx.fill();
            ctx.stroke();
        }
    }
}