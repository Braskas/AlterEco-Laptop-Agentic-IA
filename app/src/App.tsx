import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeProvider } from "./context/ThemeContext";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
