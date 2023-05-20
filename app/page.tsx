"use client";
import { useEffect } from "react";
import styled from "styled-components";

const Canvas = styled.canvas``;

export default function Home() {
  const randomIntFrom = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1) + min);
  const randomFloatFrom = (min: number, max: number): number =>
    Math.random() * (max - min + 1) + min;
  const randomColor = (colors: string[]): string =>
    colors[Math.floor(Math.random() * colors.length)];
  const getDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number => {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(xDistance ** 2 + yDistance ** 2);
  };
  const rotate = (
    velocity: { x: number; y: number },
    angle: number
  ): { x: number; y: number } => {
    const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
    };
    return rotatedVelocities;
  };
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    let mouse: {
      x: number | undefined;
      y: number | undefined;
    } = {
      x: undefined,
      y: undefined,
    };
    // let maxRadius = 100;
    let range = 100;
    // let gravity = 1;
    // let friction = 0.9;
    let numCircles = 25;
    let colors = [
      "142 202 230",
      "33 158 188",
      "2 48 71",
      "255 183 3",
      "251 133 0",
    ];
    let circles: Circle[] = [];
    addEventListener("resize", (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
    addEventListener("mousemove", ({ x, y }): void => {
      [mouse.x, mouse.y] = [x, y];
    });
    addEventListener("click", (): void => init());
    const resolveCollision = (circle: Circle, otherCircle: Circle): void => {
      const xVelocityDiff = circle.dx - otherCircle.dx;
      const yVelocityDiff = circle.dy - otherCircle.dy;
      const xDist = otherCircle.x - circle.x;
      const yDist = otherCircle.y - circle.y;
      if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle = -Math.atan2(
          otherCircle.y - circle.y,
          otherCircle.x - circle.x
        );
        const [m1, m2] = [circle.mass, otherCircle.mass];
        const u1 = rotate({ x: circle.dx, y: circle.dy }, angle);
        const u2 = rotate({ x: otherCircle.dx, y: otherCircle.dy }, angle);
        const v1 = {
          x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
          y: u1.y,
        };
        const v2 = {
          x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
          y: u2.y,
        };
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);
        circle.dx = vFinal1.x;
        circle.dy = vFinal1.y;
        otherCircle.dx = vFinal2.x;
        otherCircle.dy = vFinal2.y;
      }
    };
    class Circle {
      x: number;
      y: number;
      dx: number;
      dy: number;
      radius: number;
      color: string = randomColor(colors);
      opacity: number = 0;
      mass: number;
      // minRadius: number;
      constructor(
        x: number,
        y: number,
        dx: number,
        dy: number,
        radius: number
      ) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.mass = radius;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = "rgb(" + this.color + ")";
        ctx.stroke();
        ctx.fillStyle = "rgb(" + this.color + "/ " + this.opacity + ")";
        ctx.fill();
      }
      update(circles: Circle[]) {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
          this.dx = -this.dx;
          // this.dx = -this.dx * friction;
        }
        if (
          this.y + this.radius + this.dy > innerHeight ||
          this.y - this.radius < 0
        ) {
          this.dy = -this.dy;
        }
        // if (this.y + this.radius + this.dy > innerHeight) {
        //   this.dy = -this.dy * friction;
        // } else {
        //   this.dy += gravity;
        // }
        for (let i = 0; i < circles.length; i++) {
          if (this === circles[i]) continue;
          if (
            getDistance(this.x, this.y, circles[i].x, circles[i].y) -
              (this.radius + circles[i].radius) <
            0
          ) {
            resolveCollision(this, circles[i]);
          }
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
        // interactivity
        if (
          mouse.x &&
          mouse.y &&
          Math.abs(mouse.x - this.x) < range &&
          Math.abs(mouse.y - this.y) < range
        ) {
          if (this.opacity < 0.25) {
            this.opacity += 0.075;
          }
          //   if (this.radius < maxRadius) {
          //     this.radius += 10;
          //   }
        } else if (this.opacity > 0) {
          this.opacity -= 0.02;
          this.opacity = Math.max(0, this.opacity);
          //   if (this.radius > this.minRadius) {
          //     this.radius -= 10;
          //   }
        }
      }
    }
    function init() {
      circles = [];
      for (let i = 0; i < numCircles; i++) {
        let radius = randomIntFrom(5, 20);
        let x = randomIntFrom(radius, innerWidth - radius);
        let y = randomIntFrom(radius, innerHeight - radius);
        let dx = randomFloatFrom(-2, 2);
        let dy = randomFloatFrom(-2, 2);
        if (i !== 0) {
          for (let j = 0; j < circles.length; j++) {
            if (
              getDistance(x, y, circles[j].x, circles[j].y) - radius * 2 <
              0
            ) {
              x = randomIntFrom(radius, innerWidth - radius);
              y = randomIntFrom(radius, innerHeight - radius);
              j = -1;
            }
          }
        }
        circles.push(new Circle(x, y, dx, dy, radius));
      }
    }
    function animate() {
      requestAnimationFrame(animate);
      if (!ctx) return;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      circles.forEach((circle) => circle.update(circles));
    }
    init();
    animate();
  }, []);
  return <Canvas />;
}
