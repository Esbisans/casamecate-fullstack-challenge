import datetime

from pydantic import BaseModel


class AnsweredStats(BaseModel):
    answered: int
    unanswered: int


class QuestionSummary(BaseModel):
    title: str
    link: str
    score: int
    view_count: int
    is_answered: bool
    owner_name: str
    creation_date: datetime.datetime


class OldestNewestQuestions(BaseModel):
    oldest: QuestionSummary
    newest: QuestionSummary
