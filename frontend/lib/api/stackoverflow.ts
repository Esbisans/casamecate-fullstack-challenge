import { cacheLife, cacheTag } from "next/cache";
import {
  stackoverflowAnsweredCount,
  stackoverflowLeastViews,
  stackoverflowOldestNewest,
  stackoverflowTopScore,
} from "./generated";

export async function getAnsweredCount() {
  "use cache";
  cacheLife("hours");
  cacheTag("stackoverflow:answered");

  const { data } = await stackoverflowAnsweredCount({ throwOnError: true });
  return data;
}

export async function getTopScoreQuestion() {
  "use cache";
  cacheLife("hours");
  cacheTag("stackoverflow:top-score");

  const { data } = await stackoverflowTopScore({ throwOnError: true });
  return data;
}

export async function getLeastViewsQuestion() {
  "use cache";
  cacheLife("hours");
  cacheTag("stackoverflow:least-views");

  const { data } = await stackoverflowLeastViews({ throwOnError: true });
  return data;
}

export async function getOldestNewestQuestions() {
  "use cache";
  cacheLife("hours");
  cacheTag("stackoverflow:oldest-newest");

  const { data } = await stackoverflowOldestNewest({ throwOnError: true });
  return data;
}
