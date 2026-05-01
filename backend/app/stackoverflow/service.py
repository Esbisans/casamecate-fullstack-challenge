import datetime

from app.stackoverflow.client import StackOverflowClient
from app.stackoverflow.schemas import (
    AnsweredStats,
    OldestNewestQuestions,
    QuestionSummary,
)


def _to_summary(item: dict) -> QuestionSummary:
    return QuestionSummary(
        title=item["title"],
        link=item["link"],
        score=item["score"],
        view_count=item["view_count"],
        is_answered=item["is_answered"],
        owner_name=item["owner"].get("display_name", "anonymous"),
        creation_date=datetime.datetime.fromtimestamp(
            item["creation_date"], tz=datetime.UTC
        ),
    )


async def count_answered(client: StackOverflowClient) -> AnsweredStats:
    questions = await client.get_questions()
    answered = sum(1 for q in questions if q["is_answered"])
    return AnsweredStats(answered=answered, unanswered=len(questions) - answered)


async def top_by_score(client: StackOverflowClient) -> QuestionSummary:
    questions = await client.get_questions()
    top = max(questions, key=lambda q: (q["score"], q["creation_date"]))
    return _to_summary(top)


async def least_viewed(client: StackOverflowClient) -> QuestionSummary:
    questions = await client.get_questions()
    least = min(questions, key=lambda q: (q["view_count"], -q["creation_date"]))
    return _to_summary(least)


async def oldest_and_newest(client: StackOverflowClient) -> OldestNewestQuestions:
    questions = await client.get_questions()
    return OldestNewestQuestions(
        oldest=_to_summary(min(questions, key=lambda q: q["creation_date"])),
        newest=_to_summary(max(questions, key=lambda q: q["creation_date"])),
    )


async def print_summary(client: StackOverflowClient) -> None:
    try:
        top = await top_by_score(client)
        least = await least_viewed(client)
        ages = await oldest_and_newest(client)
    except Exception as exc:
        print(f"[stackoverflow] could not fetch summary: {exc}")
        return

    print("=== StackOverflow summary ===")
    print(f"[Top score] ({top.score}) {top.title}")
    print(f"  {top.link}")
    print(f"[Least viewed] ({least.view_count} views) {least.title}")
    print(f"  {least.link}")
    print(f"[Oldest] {ages.oldest.creation_date.date()} - {ages.oldest.title}")
    print(f"[Newest] {ages.newest.creation_date.date()} - {ages.newest.title}")
