"use server";

import { getAirlinesAboveN } from "./flights";

export async function fetchAirlinesAboveN(
  moreThan: number,
  year?: number
) {
  return getAirlinesAboveN(moreThan, year);
}
