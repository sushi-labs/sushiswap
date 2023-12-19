# Extractor API

## First time cluster setup

Setup the DRPC SECRET
```bash
kubectl create secret generic extractor --from-literal=DRPC_ID=XXX
```

Create a static ip for the ingress controller
```bash
gcloud compute addresses create ingress-nginx --global
```
