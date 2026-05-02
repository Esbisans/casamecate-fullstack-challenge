import type { CreateClientConfig } from "./generated/client.gen";

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: process.env.API_URL ?? "http://localhost:8000",
});
