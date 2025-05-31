// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MantineProvider, createTheme } from "@mantine/core";
import FooterContent from "./components/Layout/FooterContent.jsx";
import HeaderContent from "./components/Layout/HeaderContent.jsx";

// Create a custom pink theme
const pinkTheme = createTheme({
  primaryColor: 'pink',
  primaryShade: 6,
  colors: {
    pink: [
      '#FFF0F6',
      '#FFE3EC',
      '#FFC1D7',
      '#FFA3C2',
      '#FF85AD',
      '#FF6699',
      '#FF4785', // Primary shade
      '#FF2D71',
      '#FF1A5E',
      '#FF004A',
    ],
  },
  defaultGradient: {
    from: 'pink.5',
    to: 'pink.3',
    deg: 45,
  },
  components: {
    Button: {
      defaultProps: {
        color: 'pink',
      },
    },
    SegmentedControl: {
      defaultProps: {
        color: 'pink',
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <MantineProvider theme={pinkTheme} defaultColorScheme="light">
    <HeaderContent />
    <App />
    <FooterContent />
  </MantineProvider>
);
