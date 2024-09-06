/** @type {import('tailwindcss').Config} */
import { iconsPlugin, dynamicIconsPlugin } from "@egoist/tailwindcss-icons";
export default {
  content: [],
  theme: {
    extend: {
      screens: {
        md: "700px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [iconsPlugin(), dynamicIconsPlugin()],
};
