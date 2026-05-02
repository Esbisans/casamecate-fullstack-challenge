import { getAirlinesAboveN } from "@/lib/api";
import { ActiveAirlinesCard } from "./active-airlines-card";

const DEFAULT_THRESHOLD = 2;

type Props = {
  year?: number;
};

export async function ActiveAirlinesCardWrapper({ year }: Props) {
  const initialData = await getAirlinesAboveN(DEFAULT_THRESHOLD, year);
  return (
    <ActiveAirlinesCard
      year={year}
      initialThreshold={DEFAULT_THRESHOLD}
      initialData={initialData}
    />
  );
}
