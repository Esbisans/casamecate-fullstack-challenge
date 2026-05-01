from fastapi import APIRouter

from app.stackoverflow import service
from app.stackoverflow.dependencies import SOClientDep
from app.stackoverflow.schemas import (
    AnsweredStats,
    OldestNewestQuestions,
    QuestionSummary,
)

router = APIRouter(prefix="/stackoverflow", tags=["stackoverflow"])


@router.get(
    "/questions/answered-count",
    response_model=AnsweredStats,
    summary="Count of answered vs unanswered questions",
)
async def answered_count(client: SOClientDep):
    return await service.count_answered(client)


@router.get(
    "/questions/top-score",
    response_model=QuestionSummary,
    summary="Question with the highest score",
)
async def top_score(client: SOClientDep):
    return await service.top_by_score(client)


@router.get(
    "/questions/least-views",
    response_model=QuestionSummary,
    summary="Question with the fewest views",
)
async def least_views(client: SOClientDep):
    return await service.least_viewed(client)


@router.get(
    "/questions/oldest-newest",
    response_model=OldestNewestQuestions,
    summary="Oldest and newest questions by creation date",
)
async def oldest_newest(client: SOClientDep):
    return await service.oldest_and_newest(client)
