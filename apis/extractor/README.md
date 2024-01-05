# Extractor API

### Install Cloud Code

https://cloud.google.com/code/docs/vscode/install

### Install Helm

```bash
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

## LOCAL

### Start Minikube

Until fixed, use the following command to start minikube

```bash
minikube start --base-image gcr.io/k8s-minikube/kicbase:v0.0.40
```

## GKE

## First time cluster setup

Setup the DRPC SECRET

```bash
kubectl create secret generic extractor \
    --from-literal=DRPC_ID=XXX \
    --from-literal=SENTRY_DSN=XXX \
    --from-literal=SENTRY_ENVIRONMENT=XXX
```

Create a static ip for the staging environment
```bash
gcloud compute addresses create extractor-staging-ip --global
```

Create a static ip for the production environment
```bash
gcloud compute addresses create extractor-production-ip --global
```

## Release

gcloud deploy releases create 'extractor-$DATE-$TIME' --project=extractor-410208 --region=us-east4 --source=./apis/extractor --delivery-pipeline=extractor --images=extractor=IMAGE

