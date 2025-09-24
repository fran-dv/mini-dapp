import React, { type ReactElement } from "react";
import { type RenderOptions, render, renderHook } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as Toast from "@radix-ui/react-toast";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Toast.Provider swipeDirection="left">
      <BrowserRouter>{children}</BrowserRouter>
    </Toast.Provider>
  );
};

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

const renderHookWithProviders = <T,>(hook: () => T, options?: RenderOptions) =>
  renderHook(hook, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
export { renderHookWithProviders as renderHook };
