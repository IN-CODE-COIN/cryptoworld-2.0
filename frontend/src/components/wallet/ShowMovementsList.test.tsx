import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { ShowMovementsList } from "./ShowMovementsList";
import api from "../../lib/axios";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});
vi.mock("antd", async () => {
  const antd = await vi.importActual("antd");
  return {
    ...antd,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe("ShowMovementsList", () => {
  const mockData = [
    {
      id: 1,
      date: new Date().toISOString(),
      description: "Depósito inicial",
      amount: 100,
      type: "deposito",
    },
    {
      id: 2,
      date: new Date().toISOString(),
      description: "Retiro",
      amount: -50,
      type: "retiro",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra la tabla de movimientos después de cargar", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: mockData });

    render(
      <MemoryRouter>
        <ShowMovementsList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Depósito inicial")).toBeInTheDocument();
      expect(screen.getByText("Retiro")).toBeInTheDocument();
    });
  });
});
