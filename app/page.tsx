"use client";
import { useEffect } from "react";
import styled from "styled-components";

const Canvas = styled.canvas``;

export default function Home() {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    window?.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
    window?.addEventListener("mousemove", ({ x, y }) => {
      mouse.x = x;
      mouse.y = y;
    });
    let mouse: {
      x: number | undefined;
      y: number | undefined;
    } = {
      x: undefined,
      y: undefined,
    };
    let maxRadius = 100;
    let range = 100;
    let colors = ["#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500"];
    if (!ctx) return;
    class Circle {
      x: number;
      y: number;
      dx: number;
      dy: number;
      radius: number;
      minRadius: number;
      color: string;
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
        this.minRadius = radius;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        // interactivity
        if (
          mouse.x &&
          mouse.y &&
          Math.abs(mouse.x - this.x) < range &&
          Math.abs(mouse.y - this.y) < range
        ) {
          if (this.radius < maxRadius) {
            this.radius += 5;
          }
        } else if (this.radius > this.minRadius) {
          this.radius -= 2.5;
        }
        this.draw();
      }
    }
    let circleArray: Circle[] = [];
    for (let i = 0; i < 200; i++) {
      let radius = Math.random() * 20 + 5;
      let x = Math.random() * (innerWidth - radius * 2) + radius;
      let y = Math.random() * (innerHeight - radius * 2) + radius;
      let dx = (Math.random() - 0.5) * 10;
      let dy = (Math.random() - 0.5) * 10;
      circleArray.push(new Circle(x, y, dx, dy, radius));
    }
    function animate() {
      requestAnimationFrame(animate);
      ctx?.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
      }
    }
    function init() {
      circleArray = [];
      for (let i = 0; i < 200; i++) {
        let radius = Math.random() * 20 + 5;
        let x = Math.random() * (innerWidth - radius * 2) + radius;
        let y = Math.random() * (innerHeight - radius * 2) + radius;
        let dx = (Math.random() - 0.5) * 10;
        let dy = (Math.random() - 0.5) * 10;
        circleArray.push(new Circle(x, y, dx, dy, radius));
      }
    }
    animate();
  }, []);
  return <Canvas />;
}
