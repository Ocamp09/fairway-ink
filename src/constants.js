export const SOLID_PRICE = 14.99;
export const CUSTOM_PRICE = 15.99;
export const TEXT_PRICE = 18.99;

export const TOOL_ICON_SIZE = 28;

export const APP_ENV = import.meta.env.VITE_APP_ENV;

export const API_URL =
  APP_ENV === "prod" ? "https://api.fairway-ink.com" : "http://localhost:8000";
