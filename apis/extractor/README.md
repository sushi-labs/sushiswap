# Extractor API

...

## Copy extractor 1 cache from remote to local

```bash
kubectl exec -n default extractor-56-0 -- tar cf - /app/cache | tar xf - -C /mnt/c/extractor-cache
```