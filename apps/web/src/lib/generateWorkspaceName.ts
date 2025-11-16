const adjectives = [
  "crimson",
  "azure",
  "golden",
  "silver",
  "jade",
  "coral",
  "amber",
  "violet",
  "misty",
  "bright",
  "wild",
  "bold",
  "soft",
  "sharp",
  "warm",
  "cool",
  "lunar",
  "solar",
  "neon",
  "pastel",
];

const creatures = [
  "fox",
  "owl",
  "wolf",
  "raven",
  "swan",
  "hawk",
  "deer",
  "lynx",
  "bee",
  "moth",
  "dove",
  "wren",
  "crow",
  "jay",
  "finch",
];

const objects = [
  "brush",
  "lens",
  "quill",
  "easel",
  "prism",
  "frame",
  "sketch",
  "canvas",
  "palette",
  "studio",
  "workshop",
  "forge",
  "vault",
];

const spaces = [
  "studio",
  "atelier",
  "workshop",
  "lab",
  "forge",
  "collective",
  "house",
  "works",
  "co",
  "space",
  "room",
  "den",
];

function generateWorkspaceName() {
  const patterns = [
    // creature-space pattern (like ladybug-studios)
    () => {
      const creature = creatures[Math.floor(Math.random() * creatures.length)];
      const space = spaces[Math.floor(Math.random() * spaces.length)];
      return `${creature}-${space}`;
    },

    // adjective-object pattern (like golden-brush)
    () => {
      const adjective =
        adjectives[Math.floor(Math.random() * adjectives.length)];
      const object = objects[Math.floor(Math.random() * objects.length)];
      return `${adjective}-${object}`;
    },

    // adjective-creature-space pattern (like wild-fox-studio)
    () => {
      const adjective =
        adjectives[Math.floor(Math.random() * adjectives.length)];
      const creature = creatures[Math.floor(Math.random() * creatures.length)];
      const space = spaces[Math.floor(Math.random() * spaces.length)];
      return `${adjective}-${creature}-${space}`;
    },

    // creature-object pattern (like raven-canvas)
    () => {
      const creature = creatures[Math.floor(Math.random() * creatures.length)];
      const object = objects[Math.floor(Math.random() * objects.length)];
      return `${creature}-${object}`;
    },
  ];

  // Pick a random pattern
  const index = Math.floor(Math.random() * patterns.length);
  const selectedPattern = patterns[index];
  if (selectedPattern === undefined) {
    throw new Error("No name generation patterns available");
  }
  return selectedPattern();
}
export { generateWorkspaceName };
