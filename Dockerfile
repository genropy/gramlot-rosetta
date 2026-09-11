FROM python:3.12-slim-bookworm AS python-runtime
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 HOME=/tmp
COPY requirements.lock /tmp/requirements.lock
RUN pip install --no-cache-dir -r /tmp/requirements.lock
# Explicit approved artifact; no sibling sources or implicit latest release.
ARG GRAMLOT_WHEEL_SHA256
COPY .build/gramlot-0.1.0a1-py3-none-any.whl /tmp/gramlot-0.1.0a1-py3-none-any.whl
RUN test -n "$GRAMLOT_WHEEL_SHA256" && echo "$GRAMLOT_WHEEL_SHA256  /tmp/gramlot-0.1.0a1-py3-none-any.whl" | sha256sum -c - \
    && pip install --no-cache-dir --no-deps /tmp/gramlot-0.1.0a1-py3-none-any.whl \
    && pip check \
    && printf '{"channel":"unpublished-wheel","sha256":"%s"}\n' "$GRAMLOT_WHEEL_SHA256" > /app/runtime-provenance.json \
    && rm /tmp/*.whl \
    && groupadd --gid 10001 rosetta && useradd --uid 10001 --gid rosetta --no-create-home rosetta

FROM node:22-bookworm-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY scripts/build-gramlot.mjs scripts/build-gramlot.mjs
COPY shared shared
RUN npm run build:editor
COPY frontends/pages-js frontends/pages-js
COPY --from=python-runtime /usr/local/lib/python3.12/site-packages/gramlot /opt/gramlot
RUN GRAMLOT_ROSETTA_PACKAGE_ROOT=/opt/gramlot npm run build:gramlot
COPY frontends/react frontends/react
COPY frontends/vue frontends/vue
RUN npm --prefix frontends/react ci --no-audit --no-fund && npm --prefix frontends/react run build
RUN npm --prefix frontends/vue ci --no-audit --no-fund && npm --prefix frontends/vue run build

FROM python-runtime AS runtime
LABEL org.opencontainers.image.source="https://github.com/genropy/gramlot-site"
LABEL org.opencontainers.image.url="https://github.com/genropy/gramlot-rosetta"
WORKDIR /app
COPY backend backend
COPY frontends frontends
COPY --from=frontend /app/frontends/react/dist frontends/react/dist
COPY --from=frontend /app/frontends/vue/dist frontends/vue/dist
COPY --from=frontend /app/shared shared
COPY deploy/application.py deploy/application.py
ENV GRAMLOT_ROSETTA_MODE=production
USER 10001:10001
EXPOSE 8000
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=3)"
CMD ["python", "-m", "uvicorn", "deploy.application:create_app", "--factory", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips", "*"]
