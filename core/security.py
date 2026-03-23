from django.core.cache import cache
from django.conf import settings


def get_client_ip(request):
    remote_addr = request.META.get("REMOTE_ADDR", "").strip()
    trusted_proxies = set(getattr(settings, "TRUSTED_PROXY_IPS", []))

    # Solo confia en X-Forwarded-For cuando la peticion
    # llega desde un proxy explicitamente confiable.
    if remote_addr and remote_addr in trusted_proxies:
        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded_for and not remote_addr:
        return forwarded_for.split(",")[0].strip()
    return remote_addr


def is_rate_limited(key, limit, window_seconds):
    cache_key = f"ratelimit:{key}"
    added = cache.add(cache_key, 1, timeout=window_seconds)
    if added:
        return False

    try:
        current = cache.incr(cache_key)
    except ValueError:
        cache.set(cache_key, 1, timeout=window_seconds)
        return False

    return current > limit
