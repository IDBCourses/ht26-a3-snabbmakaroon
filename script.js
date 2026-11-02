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
const fireShape = createShape();


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

let maxAverage = 5;

let bender = air;
let style = "normal";

let gap = 0;
let timeEnter = [];
let timeLeave =[];
let maxGap = 1500;

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

const reverbWater = new Tone.Reverb({decay: 3, wet: 0.9}).toDestination();
const vibrato = new Tone.Vibrato({frequency: 5, type: "sine", depth: 0.2}).connect(reverbWater)
const synthWater = new Tone.PolySynth(Tone.Synth).connect(vibrato);

const reverbEarth = new Tone.Reverb({decay: 3, wet: 0.35}).toDestination();
const synthEarth = new Tone.PolySynth(Tone.Synth).connect(reverbEarth)

const reverbFire = new Tone.Reverb({decay: 3, wet: 0.35}).toDestination();
const vibrato3 = new Tone.Vibrato({frequency: 5, type: "sine", depth: 0.2}).connect(reverbFire)
const synthFire = new Tone.FMSynth().connect(vibrato3);

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  speeds.shift();
  use();
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  let total = 0;
  for (let i = 0; i < speeds.length; i++) {
    total = total + speeds[i];
  }

  let average = 0
  if (speeds.length > 0) {
    average = total / speeds.length;

  }  if (average > maxAverage) {
    average = maxAverage;
    }
  let normAverage = average / maxAverage; //normalised average for the angle equation

  let volume = -30 + average * 5;
  if (volume > 0) {
    volume = 0;
  }
  synth.volume.value = volume;
  synthWater.volume.value = volume;
  synthEarth.volume.value = volume;
  synthFire.volume.value = volume;


  let angle = 1 - normAverage; //inverted values, high average equates to low value for angle
  square.setRoundedness(angle);
  square2.setRoundedness(angle);
  square3.setRoundedness(angle);
  square4.setRoundedness(angle);
  square5.setRoundedness(angle);
  square6.setRoundedness(angle);

   if (speeds.length === 0) { //sets shape back to circle if array empty
      square.setRoundedness(0.5);
      square2.setRoundedness(0.5);
      square3.setRoundedness(0.5);
      square4.setRoundedness(0.5);
      square5.setRoundedness(0.5);
      square6.setRoundedness(0.5);
    }
  setTimeout(use, 100);// call use() again in 100 milliseconds

}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function startSound() {
  Tone.start();
}

function Chime(bend, octaveNum, ChimeStyle) {
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

function shapeSettings(shape, x, y, size, hue) {
  shape.setPosition(x, y);
  shape.setSize(size);
  shape.setColour(hue, 30, 40);
}

function timeEnterCircle() {
  timeEnter.push(Date.now());
  if (timeEnter.length > 1) { //only want one value in each array at a time
    timeEnter.shift();
  }
}

function timeLeaveCircle() {
  timeLeave.push(Date.now());
  if (timeLeave.length > 1) {
    timeLeave.shift();
  }
}


function playMelody () {
  gap = timeLeave[0] - timeEnter[0];
  if (gap > maxGap) {
    gap = maxGap;
  }
  let normGap = gap / maxGap; // "wet" is any number from 0-1 so had to normalise gap

  let i = Math.floor(Math.random() * 4)
  if (style === "normal") {
    synth.triggerAttackRelease(bender[i] + octave, duration)
  }
  if (style === "water") {
    reverbWater.wet.value = normGap;
    synthWater.triggerAttackRelease(bender[i] + octave, duration);
  }
  if (style === "earth") {
    reverbEarth.wet.value = normGap;
    synthEarth.triggerAttackRelease(bender[i] + octave, duration);
  }
  if (style === "fire") {
    reverbFire.wet.value = normGap;
    synthFire.triggerAttackRelease(bender[i] + octave, duration);
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

  lastX = normX
  lastY = normY
  lastTime = now;
  //console.log(speed);

  speeds.push(speed);
  if (speeds.legnth > 10) {
    speeds.shift()
  }
  setTimeout(update, 500);
  use();
}


// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  shapeSettings(square, 0.2, 0.09, 750, 300);
  shapeSettings(square2, 0.25, 0.15, 650, 650);
  shapeSettings(square3, 0.3, 0.2, 550, 550);
  shapeSettings(square4, 0.35, 0.25, 450, 150);
  shapeSettings(square5, 0.4, 0.3, 350, 800);
  shapeSettings(square6, 0.45, 0.35, 250, 50);

  shapeSettings(airShape, 0, 0, 100, 190);
  shapeSettings(earthShape, 0, 0.88, 100, 15);
  shapeSettings(waterShape, 0.85, 0.88, 100, 160);
  shapeSettings(fireShape, 0.85, 0, 100, 350);

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
  earthShape.element.addEventListener("pointerenter", timeEnterCircle);
  earthShape.element.addEventListener("pointerleave", timeLeaveCircle);

  waterShape.element.addEventListener("pointerdown", () => Chime(water, "4", "water"));
  waterShape.element.addEventListener("pointerenter", timeEnterCircle);
  waterShape.element.addEventListener("pointerleave", timeLeaveCircle);

  fireShape.element.addEventListener("pointerdown", () => Chime(fire, "4", "fire"));
  fireShape.element.addEventListener("pointerenter", timeEnterCircle);
  fireShape.element.addEventListener("pointerleave", timeLeaveCircle);

}

setup(); // Always remember to call setup()!
