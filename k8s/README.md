# Kubernetes

## Install Docker Desktop

https://www.docker.com/products/docker-desktop/

## Install and turn on Kubernetes

https://docs.docker.com/desktop/kubernetes/#install-and-turn-on-kubernetes

## Install Cloud Code

https://cloud.google.com/code/docs/vscode/install

## Install Helm

```bash
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

## LOCAL

In Cloud Code extension, click on the Kubernetes icon on the left sidebar and click on the plus icon to add a new cluster. Select Docker Desktop and click on the add button.


<!-- ### Start Minikube

Until fixed, use the following command to start minikube

```bash
minikube start --base-image gcr.io/k8s-minikube/kicbase:v0.0.40
``` -->

## Google Cloud Staging & Production

### Set Project

```bash
gcloud config set project sushi-api-414412
```

### Create Secret

```bash
kubectl create secret generic sushi-api \
    --from-literal=DRPC_ID=XXX \
    --from-literal=RSK_ID=XXX \
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
gcloud deploy releases create 'sushi-api-$DATE-$TIME' --project=sushi-api-414412 --region=us-east4 --source=. --delivery-pipeline=sushi-api --images=extractor=,router=
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

### Scale Down

```bash
kubectl scale --replicas=0 deployment --all && kubectl scale --replicas=0 statefulset --all
```

### Shell

```bash
kubectl exec --stdin --tty extractor-56-0 -- /bin/bash
```

### Copy

Remote to local:

```bash
kubectl cp -n default extractor-56-0:/app/cache ./cache
```
Local to remote:

copies the cache folder to the extractor-56-0 app folder, replacing current cache folder (careful...)

```bash
kubectl cp  -n default ./cache/56 extractor-56-0:/app/cache
```


### Port Forward

https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/

Example for downloading binary pool codes from the internal extractor API on base:

```bash
kubectl port-forward statefulset/extractor-8453 3000:80
```

http://localhost:3000/pool-codes-bin/8453

### Debug

kubectl run -it --rm --restart=Never curl --image=curlimages/curl:latest sh

### Restart Router

kubectl rollout restart deployment/router-1

### Restart Extractor

kubectl rollout restart statefulset/extractor-1