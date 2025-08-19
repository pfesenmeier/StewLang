export type KeyPressEvents = {
  type: "up";
} | {
  type: "down";
} | {
  type: "left";
} | {
  type: "right";
} | {
  type: "space";
} | {
  type: "enter";
} | {
  type: "tab";
} | {
  type: "shiftab";
} | {
  type: "help";
} | {
  type: "keyPress"
  data: string
}
