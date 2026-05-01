from typing import Annotated

from fastapi import Depends, Request

from app.stackoverflow.client import StackOverflowClient


def get_so_client(request: Request) -> StackOverflowClient:
    return request.app.state.so_client


SOClientDep = Annotated[StackOverflowClient, Depends(get_so_client)]
