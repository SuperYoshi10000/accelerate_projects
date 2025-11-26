export interface Vector2 {
    x: number;
    y: number;
}
export namespace Vector2 {
    export const ZERO: Vector2 = {x: 0, y: 0};
}

export class View implements Vector2 {
    x: number = 0;
    y: number = 0;
    scale: number = 100;
    constructor() {}

    calcPosXY(pos: Vector2): [number, number] {
        return [
            (pos.x - this.x) * this.scale,
            (pos.y - this.y) * this.scale
        ];
    }
}

export class GravitySimulation {
    static readonly GRAVITATIONAL_CONSTANT = 6.6743e-11;
    bodies: Body[];
    view: View;

    constructor(view: View, bodies?: Body[]);
    constructor(view: View, count: number, canvas: HTMLCanvasElement);
    constructor(view: View, p1: Body[] | number = 0, canvas?: HTMLCanvasElement) {
        this.view = view;
        if (Array.isArray(p1)) this.bodies = p1;
        else this.bodies = Array.from({length: p1}, () => Body.createRandom(canvas!, view));
    }

    calculateGravity() {
        const forces: Vector2[] = new Array(this.bodies.length).fill(Vector2.ZERO);
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const body1 = this.bodies[i];
                const body2 = this.bodies[j];
                const [force1, force2] = GravitySimulation.calculateBodyGravity(body1, body2);
                forces[i] = {x: forces[i].x + force1.x, y: forces[i].y + force1.y};
                forces[j] = {x: forces[j].x + force2.x, y: forces[j].y + force2.y};
            }
        }
        return forces;
    }

    updateBodies(dt: number) {
        const forces = this.calculateGravity();
        this.bodies.forEach((body, index) => body.move(forces[index], dt));
    }

    static calculateBodyGravity(body1: Body, body2: Body): [Vector2, Vector2] {
        const distanceX = body2.x - body1.x;
        const distanceY = body2.y - body1.y;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        const force = (GravitySimulation.GRAVITATIONAL_CONSTANT * body1.mass * body2.mass) / (distance ** 2);
        // This will either work or make them go in the completely opposite direction
        const force1 = {x: force * distanceX / distance, y: force * distanceY / distance };
        const force2 = {x: -force1.x, y: -force1.y };
        return [force1, force2];
    }
}



export class Body implements Vector2 {
    x: number = 0;
    y: number = 0;
    mass: number = 1;
    velocity: Vector2 = {x: 0, y: 0};

    display: BodyDisplay;

    constructor(display?: BodyDisplay) {
        this.display = display ?? new BodyDisplay();
    }

    move(force: Vector2, dt: number) {
        // Probably more accurate when dt is lower

        this.velocity.x += (force.x / this.mass) * dt;
        this.velocity.y += (force.y / this.mass) * dt;

        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
    }
    
    static createRandom(canvas: HTMLCanvasElement, view: View): Body {
        let mass = Math.random();
        const body = new Body(BodyDisplay.createRandom());
        body.x = Math.random() * canvas!.width / view.scale;
        body.y = Math.random() * canvas!.height / view.scale;
        body.mass = mass * 1e10 + 1e9;
        body.display.size = Math.cbrt(mass) * 20;
        return body;
    }
}

export interface BodyDisplayOptions {
    color?: string;
    size?: number;
    borderColor?: string;
    borderWidth?: number;
    borderFirst?: boolean;
    drawColor?: string;
    drawWidth?: number;
    drawFadeTime?: number;
}


export class BodyDisplay implements BodyDisplayOptions {
    color: string;
    size: number;
    borderColor: string;
    borderWidth: number;
    borderFirst: boolean;
    drawColor: string;
    drawWidth: number;
    drawFadeTime: number;

    constructor(options: BodyDisplayOptions = {}) {
        this.color = options.color || "black";
        this.size = options.size || 10;
        this.borderColor = options.borderColor || "black";
        this.borderWidth = options.borderWidth || 1;
        this.borderFirst = options.borderFirst || false;
        this.drawColor = options.drawColor || "black";
        this.drawWidth = options.drawWidth || 1;
        this.drawFadeTime = options.drawFadeTime || 0;
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

    static createRandom(options: BodyDisplayOptions = {}): BodyDisplay {
        let color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        return new BodyDisplay({
            color: color,
            drawColor: color,
            drawFadeTime: 5,
            ...options
        });
    }
}