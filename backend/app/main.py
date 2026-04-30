from fastapi import FastAPI

app = FastAPI(title="Casa Mecate API")


@app.get("/health")
def health():
    return {"status": "ok"}
