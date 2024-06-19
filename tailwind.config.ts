/** @type {import('tailwindcss').Config} */
import { iconsPlugin, dynamicIconsPlugin } from "@egoist/tailwindcss-icons";
export default {
  content: [],
  theme: {
    extend: {
      screens: {
        md: "700px",
      },
    },
  },
  plugins: [iconsPlugin(), dynamicIconsPlugin()],
};
