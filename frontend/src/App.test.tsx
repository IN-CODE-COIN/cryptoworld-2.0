import { render, screen } from "@testing-library/react";
import App from "./App";

test("renderiza los elementos principales", () => {
  render(<App />);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("main")).toBeInTheDocument();
});
