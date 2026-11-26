/* Your own audio recordings. Put the files in assets/audio/ and list them here.
   Each entry adds a play/stop button (looping) to the Relax tab. */
const SOUND_FILES = [
  { name: "Night wildlife", ms: "Hidupan liar malam", file: "assets/audio/night-wildlife.mp3" },
  { name: "Rain and rainforest", ms: "Hujan dan hutan hujan", file: "assets/audio/rainforest-rain.mp3" },
  { name: "Seaside waves", ms: "Ombak tepi laut", file: "assets/audio/seaside-waves.mp3" },
];
if (typeof module !== "undefined") module.exports = SOUND_FILES;
