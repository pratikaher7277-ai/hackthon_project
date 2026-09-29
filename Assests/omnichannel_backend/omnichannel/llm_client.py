"""Ollama LLM client for local sentiment analysis."""
from __future__ import annotations

import asyncio
import json
import os
from typing import Optional

import httpx


class OllamaClient:
    """Async client for Ollama local LLM server."""

    def __init__(
        self,
        base_url: str = "http://localhost:11434",
        model: str = "llama3.2:3b",
        timeout: float = 30.0,
    ):
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.timeout = timeout
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=self.timeout)
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    async def generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.1,
        max_tokens: int = 100,
    ) -> Optional[str]:
        """Generate text from Ollama."""
        client = await self._get_client()
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }
        if system:
            payload["system"] = system

        try:
            resp = await client.post(f"{self.base_url}/api/generate", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data.get("response", "").strip()
        except Exception as e:
            print(f"[OllamaClient] Error: {e}")
            return None

    async def chat(
        self,
        messages: list[dict[str, str]],
        temperature: float = 0.1,
        max_tokens: int = 100,
    ) -> Optional[str]:
        """Chat completion via Ollama."""
        client = await self._get_client()
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }
        try:
            resp = await client.post(f"{self.base_url}/api/chat", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data.get("message", {}).get("content", "").strip()
        except Exception as e:
            print(f"[OllamaClient] Chat error: {e}")
            return None

    async def health_check(self) -> bool:
        """Check if Ollama is reachable."""
        try:
            client = await self._get_client()
            resp = await client.get(f"{self.base_url}/api/tags", timeout=5.0)
            return resp.status_code == 200
        except Exception:
            return False


_DEFAULT_CLIENT: Optional[OllamaClient] = None


def get_ollama_client() -> OllamaClient:
    """Get or create singleton Ollama client."""
    global _DEFAULT_CLIENT
    if _DEFAULT_CLIENT is None:
        model = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        _DEFAULT_CLIENT = OllamaClient(base_url=base_url, model=model)
    return _DEFAULT_CLIENT


async def close_ollama_client():
    global _DEFAULT_CLIENT
    if _DEFAULT_CLIENT:
        await _DEFAULT_CLIENT.close()
        _DEFAULT_CLIENT = None