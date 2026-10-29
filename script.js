/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.

const square = createShape();
const square2 = createShape();
const square3 = createShape();
const square4 = createShape();
const square5 = createShape();
const square6 = createShape();

const airShape = createShape();
const earthShape = createShape();
const waterShape = createShape();


const water = ["A", "D", "F", "G"];
const air = ["A", "C", "E", "B"];
const earth = ["G", "C", "E", "F"];
const fire = ["G", "B", "D", "A"];
// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

let duration = "8n";
let octave = 5

let inside = false;
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let speeds = [];
let maxSpeed = 23;
let minSpeed = 0;

let maxAverage = 5

let bender = air

let style = "normal"





// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

const reverb = new Tone.Reverb({decay: 3, wet: 0.9}).toDestination();
const vibrato = new Tone.Vibrato({frequency: 5, type: "sine", depth: 0.2}).connect(reverb)
const synthWater = new Tone.PolySynth(Tone.Synth).connect(vibrato);

const reverb2 = new Tone.Reverb({decay: 3, wet: 0.35}).toDestination();
const synthEarth = new Tone.PolySynth(Tone.Synth).connect(reverb2)

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function startSound() {
  Tone.start();
}

function Chime (bend, octaveNum, ChimeStyle) {
  bender = bend;
  octave = octaveNum;
  style = ChimeStyle;
}

function enterShape(shape, hue) {
  shape.setColour(hue, 80, 50);
  inside = true;
  playMelody()
}

function leaveShape(shape, hue) {
  shape.setColour(hue, 30, 40);
  inside = false
}

function playMelody () {
  let i = Math.floor(Math.random() * 4)
  if (style === "normal") {
  synth.triggerAttackRelease(bender[i] + octave, "16n")
  }
  if (style === "water") {
    synthWater.triggerAttackRelease(bender[i] + octave, duration);
  }
  if (style === "earth") {
    synthEarth.triggerAttackRelease(bender[i] + octave, duration);
  }
}


function pointerMove(event) {
  if (!inside) {
    return;
  }

  let normX = event.clientX / window.innerWidth;
  let normY = event.clientY / window.innerHeight;
  let now = Date.now()
  let distance = Math.hypot(normX - lastX, normY - lastY);
  let seconds = (now - lastTime) / 1000;
  if (seconds === 0) {
    return; //  takes into account if two things happen at once
  }
  let speed = distance / seconds;
    if (speed > maxSpeed) {
      speed = maxSpeed;
    } if (speed < minSpeed) {
      speed = minSpeed
    }
  lastX = normX
  lastY = normY
  lastTime = now;
  //console.log(speed);

  speeds.push(speed);
  if (speeds.legnth > 10) {
    speeds.shift()
  }
  setTimeout(forgerOldest, 500);
  useAverage();
}

function forgerOldest() {
  speeds.shift();
  useAverage();
  //console.log(speeds.length)
}

function useAverage() {
  let total = 0;
  for (let i = 0; i < speeds.length; i++) {
    total = total + speeds[i];
    //console.log(speeds[i])
  }

  let average = 0
  if (speeds.length > 0) {
    average = total / speeds.length;

  }  if (average > maxAverage) {
    average = maxAverage
    }
  let normAverage = average / maxAverage

  let volume = -30 + average * 5;
  if (volume > 0) {
    volume = 0
  }
  synth.volume.value = volume;
  synthWater.volume.value = volume
  synthEarth.volume.value = volume


  let angle = 1 - normAverage;
  square.setRoundedness(angle);
  square2.setRoundedness(angle);
  square3.setRoundedness(angle);
  square4.setRoundedness(angle);
  square5.setRoundedness(angle);
  square6.setRoundedness(angle);
  console.log("angle is, " + angle + " average is, " + normAverage);


   if (speeds.length === 0) {
      square.setRoundedness(0.5);
      square2.setRoundedness(0.5);
      square3.setRoundedness(0.5);
      square4.setRoundedness(0.5);
      square5.setRoundedness(0.5);
      square6.setRoundedness(0.5);
    }
 // console.log(average, speeds.length);
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  square.setPosition(0.2, 0.09);
  square.setRoundedness();
  square.setSize(750);
  square.setColour(300, 30, 40);

  square2.setPosition(0.25, 0.15);
  square2.setRoundedness();
  square2.setSize(650);
  square2.setColour(650, 30, 40);

  square3.setPosition(0.3, 0.2);
  square3.setSize(550);
  square3.setColour(550, 30, 40);

  square4.setPosition(0.35, 0.25);
  square4.setSize(450);
  square4.setColour(150, 30, 40);

  square5.setPosition(0.4, 0.3);
  square5.setSize(350);
  square5.setColour(800, 30, 40);

  square6.setPosition(0.45, 0.35);
  square6.setSize(250);
  square6.setColour(50, 30, 40)

  airShape.setColour(192, 70, 50);
  airShape.setPosition(0, 0.02);

  earthShape.setColour(12, 70, 50);
  earthShape.setPosition(0, 0.9);

  waterShape.setColour(162, 70, 50);
  waterShape.setPosition(0.9, 0.9);


  // Put your event listener code here
  window.addEventListener("pointerdown", startSound);
  window.addEventListener("pointermove", pointerMove);

  square.element.addEventListener("pointerenter", () => enterShape(square, 300));
  square.element.addEventListener("pointerleave", () => leaveShape(square, 300));

  square2.element.addEventListener("pointerleave", () => leaveShape(square2, 650));
  square2.element.addEventListener("pointerenter", () => enterShape(square2, 650));

  square3.element.addEventListener("pointerenter", () => enterShape(square3, 550));
  square3.element.addEventListener("pointerleave", () => leaveShape(square3, 550));

  square4.element.addEventListener("pointerenter", () => enterShape(square4, 150));
  square4.element.addEventListener("pointerleave", () => leaveShape(square4, 150));

  square5.element.addEventListener("pointerenter", () => enterShape(square5, 800));
  square5.element.addEventListener("pointerleave", () => leaveShape(square5, 800));

  square6.element.addEventListener("pointerenter", () => enterShape(square6, 50));
  square6.element.addEventListener("pointerleave", () => leaveShape(square6, 50));

  //airShape.element.addEventListener("pointerdown", airChime);

  airShape.element.addEventListener("pointerdown", () => Chime(air, "5", "normal"));

  earthShape.element.addEventListener("pointerdown", () => Chime(earth, "3", "earth"));

  waterShape.element.addEventListener("pointerdown", () => Chime(water, "4", "water"));


}

setup(); // Always remember to call setup()!
