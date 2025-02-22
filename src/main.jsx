// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";
import FooterContent from "./components/Layout/FooterContent.jsx";
import HeaderContent from "./components/Layout/HeaderContent.jsx";

createRoot(document.getElementById("root")).render(
  <MantineProvider>
    <HeaderContent />
    <App />
    <FooterContent />
  </MantineProvider>
);
