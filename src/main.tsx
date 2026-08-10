import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App";
import "./styles/index.css";
// Anton, self-hosted. The badge canvas draws the registrant's name in it, and
// canvas silently substitutes a fallback face if the font isn't loaded — so it
// is bundled rather than fetched from a CDN at render time.
import "@fontsource/anton";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);