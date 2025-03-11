export const COLOURS = {
  black: "#3A3335", // jet
  light_mode_white: "#FDF0D5", //papya whip
  accent_01: "#C6D8D3", //ash gray
  accent_02: "#197BBD", // blue
  accent_03: "#037171", // caribbean green
  accent_04: "#03312E", // dark jungle green

  //card_colours: ['hsl(176, 52%, 80%)', 'hsl(284, 57%, 80%)', 'hsl(20, 49%, 80%)'],
  card_colours: ["#C76D7E33", "#3772FF33", "#E5C4B3"],

  primary_blue: "#003366",
  white: "#FFFFFF",
  dark_mode_black: "#121212",

  light_pink: "#f1e7f3",
  pink: "#ff5e64",

  blue: "#38ccff",
  gold: "#fad869",
  yellow: "#fde19b",
  light_yellow: "hsl(43, 97%, 80%)",

  lilac: "hsl(263, 29%, 32%)",

  spotify_green: "#1DB954",
};

export enum PageClassName {
  Rifflandia = "rifflandia",
  PachenaBay = "pachena",
  PhillipsBackyard = "phillips-backyard",
  PhillipsBackyard2024 = "phillips-backyard-2024",
  LaketownShakedown = "laketown-shakedown",
  Rifflandia2024 = "rifflandia-2024",
  LampPost = "lamp-post",
}

export const primaryButtonColours = {
  color: COLOURS.black,
  backgroundColor: COLOURS.blue,
  ":hover": {
    backgroundColor: COLOURS.card_colours[1],
  },
};

export const secondaryButtonColours = {
  color: COLOURS.black,
  backgroundColor: COLOURS.accent_01,
  ":hover": {
    backgroundColor: COLOURS.card_colours[1],
  },
};

export enum SpotifyColour {
  Black = "black",
  White = "white",
  Green = "green",
}
