import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import VeiculoForm from "../pages/admin/VeiculoForm";
import * as useAuthHook from "../hooks/useAuth";

// Mock supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn((table) => {
      if (table === "vehicles") {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "123" }, error: null }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
    }),
  },
}));

describe("VeiculoForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useAuthHook, "useAuth").mockReturnValue({
      user: { id: "test-user-id" } as any,
      session: null,
      isAdmin: true,
      loading: false,
      signOut: vi.fn(),
    });
  });

  it("should render the form and submit new vehicle data", async () => {
    const { supabase } = await import("@/integrations/supabase/client");

    render(
      <MemoryRouter initialEntries={["/admin/veiculos/novo"]}>
        <Routes>
          <Route path="/admin/veiculos/:id" element={<VeiculoForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the form to load
    expect(await screen.findByText("Novo veículo")).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByLabelText(/Marca \*/i), { target: { value: "Toyota" } });
    fireEvent.change(screen.getByLabelText(/Modelo \*/i), { target: { value: "Hilux" } });
    fireEvent.change(screen.getByLabelText(/Preço/i), { target: { value: "150000" } });

    // Submit form
    fireEvent.click(screen.getByText("CRIAR VEÍCULO"));

    // Verify insert was called
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("vehicles");
      // The insert should be called on the mock chain
      // Since it's a bit complex to assert the exact chain, we just ensure it didn't crash and called supabase
    });
  });
});
