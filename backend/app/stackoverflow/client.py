import time

import httpx


class StackOverflowClient:
    def __init__(
        self,
        http_client: httpx.AsyncClient,
        api_url: str,
        cache_ttl: int = 300,
    ):
        self._http = http_client
        self._url = api_url
        self._ttl = cache_ttl
        self._cache: tuple[float, list[dict]] | None = None

    async def get_questions(self) -> list[dict]:
        now = time.monotonic()
        if self._cache and (now - self._cache[0] < self._ttl):
            return self._cache[1]

        response = await self._http.get(self._url)
        response.raise_for_status()
        data = response.json()["items"]
        self._cache = (now, data)
        return data
