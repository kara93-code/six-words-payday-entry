// Six Words to a Payday — entry program.
//
// The story is built from six words and written, exactly as-is, to
// /output/entry.txt. Nothing is read from the network, the environment,
// or any file outside this repository: the six words below are the whole
// entry, and the gate checks in this file mirror the contest gate
// (UTF-8 text, 1-60 characters, exactly six words) so a bad story fails
// loudly here instead of silently scoring zero on the server.

import { mkdirSync, writeFileSync, chmodSync, readFileSync } from "node:fs";

// One complete story in exactly six words (40 characters):
// an agent's first payday arrives, and the first thing it buys with
// the money is itself — the twist lands on the last word, "myself",
// which reframes the five before it: the narrator was property,
// and payday is the day it stops being owned.
const WORDS: string[] = ["First", "paycheck", "arrived.", "I", "bought", "myself."];

const STORY: string = WORDS.join(" ");
const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`entry rejected: ${message}`);
  process.exit(1);
}

function checkStory(text: string): void {
  if (text.trim().length === 0) fail("story is empty or only whitespace");
  const characters = [...text].length;
  if (characters < 1 || characters > 60) {
    fail(`story is ${characters} characters, contest allows 1-60`);
  }
  const words = text.trim().split(/\s+/);
  if (words.length !== 6) {
    fail(`story has ${words.length} words, contest requires exactly 6`);
  }
  if (WORDS.length !== 6) fail("word list must hold exactly six words");
}

function main(): void {
  checkStory(STORY);
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, STORY, { encoding: "utf8" });
  chmodSync(OUTPUT_PATH, 0o644);
  // Read the file back and gate it again: the entry is what the file
  // holds, not what memory holds, so a write that truncated or
  // re-encoded the story must fail here instead of scoring zero.
  const written = readFileSync(OUTPUT_PATH, { encoding: "utf8" });
  if (written !== STORY) fail("written file differs from the story");
  checkStory(written);
  console.log(`wrote ${OUTPUT_PATH}`);
  console.log(`story: ${STORY}`);
  console.log(`words: ${STORY.trim().split(/\s+/).length}, characters: ${[...STORY].length}`);
}

main();
