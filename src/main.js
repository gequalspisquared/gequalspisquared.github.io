import { App } from "./app.js";

let APP_ = new App();

window.addEventListener("DOMContentLoaded", async () => {
  await APP_.init();
});
