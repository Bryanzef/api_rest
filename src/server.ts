import { app } from "./app";

app
  .listen({
    port: 3334,
  })
  .then(() => {
    console.log("Server Running on http://localhost:3334");
  });
