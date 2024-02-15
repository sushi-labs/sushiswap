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

## Google Cloud

### Set Project

```bash
gcloud config set project sushi-api-414412
```

### Create Secret

```bash
kubectl create secret generic sushi-api \
    --from-literal=DRPC_ID=XXX \
    --from-literal=SENTRY_DSN=XXX \
    --from-literal=SENTRY_ENVIRONMENT=XXX
```

### Create a static ip for the staging environment

```bash
gcloud compute addresses create sushi-api-staging-ip --global
```

### Create a static ip for the production environment

```bash
gcloud compute addresses create sushi-api-production-ip --global
```

### Deploy

```bash
gcloud deploy apply --file=clouddeploy.yaml --region=us-east4 --project=sushi-api-414412
```

### Release

```bash
gcloud deploy releases create 'sushi-api-$DATE-$TIME' --project=sushi-api-414412 --region=us-east4 --source=. --delivery-pipeline=sushi-api --images=extractor=IMAGE,router=IMAGE
```

### View Router HPA

```bash
kubectl get hpa router-1-hpa --watch
```

### View Extractor VPA

```bash
kubectl get vpa extractor-1-vpa --watch
```

### Restart

```bash
kubectl rollout restart deployment/extractor-1
```