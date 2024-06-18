/** @type {import('tailwindcss').Config} */
import { iconsPlugin, dynamicIconsPlugin } from "@egoist/tailwindcss-icons";
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [iconsPlugin(), dynamicIconsPlugin()],
};
