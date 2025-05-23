import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import { CUSTOM_PRICE, SOLID_PRICE, TEXT_PRICE } from "../constants";

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe("CartContext", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("adds items to the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart("123", "model.stl", 2, "solid");
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]).toMatchObject({
      stlUrl: "model.stl",
      quantity: 2,
      templateType: "solid",
    });
  });

  it("removes an item from the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart("123", "model.stl", 1, "solid");
      result.current.removeFromCart("model.stl");
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it("updates quantity correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart("123", "model.stl", 1, "solid");
      result.current.updateQuantity("model.stl", 5);
    });

    expect(result.current.cartItems[0].quantity).toBe(5);
  });

  it("clears the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart("1", "one.stl", 1, "solid");
      result.current.addToCart("2", "two.stl", 1, "text");
      result.current.clearCart();
    });

    expect(result.current.cartItems).toEqual([]);
  });

  it("calculates correct total", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart("1", "one.stl", 1, "solid");
      result.current.addToCart("2", "two.stl", 2, "text");
      result.current.addToCart("3", "three.stl", 3, "custom");
    });

    const total = SOLID_PRICE * 1 + TEXT_PRICE * 2 + CUSTOM_PRICE * 3;
    expect(result.current.getTotal()).toBe(total);
  });

  it("returns item count", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart("1", "one.stl", 1, "solid");
      result.current.addToCart("2", "two.stl", 1, "text");
    });

    expect(result.current.getItemCount()).toBe(2);
  });
});
