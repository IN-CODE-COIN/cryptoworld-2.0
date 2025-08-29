import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ButtonCollapseSider } from "./ButtonCollapseSider";

describe("ButtonCollapseSider", () => {
  it("renderiza el ícono de MenuFoldOutlined cuando collapsed=false", () => {
    const toggleMock = vi.fn();
    render(
      <ButtonCollapseSider collapsed={false} toggleCollapsed={toggleMock} />
    );

    // El icono se renderiza como un <svg>, verificamos con aria-hidden
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
  });

  it("renderiza el ícono de MenuUnfoldOutlined cuando collapsed=true", () => {
    const toggleMock = vi.fn();
    render(
      <ButtonCollapseSider collapsed={true} toggleCollapsed={toggleMock} />
    );

    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
  });

  it("ejecuta toggleCollapsed al hacer clic", () => {
    const toggleMock = vi.fn();
    render(
      <ButtonCollapseSider collapsed={false} toggleCollapsed={toggleMock} />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(toggleMock).toHaveBeenCalledTimes(1);
  });

  it("aplica estilos personalizados y theme=dark", () => {
    const toggleMock = vi.fn();
    render(
      <ButtonCollapseSider
        collapsed={false}
        toggleCollapsed={toggleMock}
        theme="dark"
        iconSize={30}
        style={{ marginLeft: "10px" }}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({
      fontSize: "30px",
      color: "#fff",
      marginLeft: "10px",
    });
  });
});
