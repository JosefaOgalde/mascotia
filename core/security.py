from django.core.cache import cache


def get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


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
