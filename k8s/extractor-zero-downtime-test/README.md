# Zero Downtime Solution

We can achieve zero downtime by using a shared Persistent Volume (PV) between two StatefulSets.

## Install Minikube

### Installation

Install Minikube with the following commands:

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64
```

### Start Minikube

Start your Minikube cluster with:

```bash
minikube start
```

## Interact with Your Cluster

You can interact with your cluster using `kubectl`. Ensure `kubectl` is configured to use Minikube.

## Deploy StatefulSets with Shared PVC

To deploy the StatefulSets with a shared PVC, navigate to the root directory and run:

```bash
kubectl apply -k ./k8/extractor-zero-downtime-test/
```

Verify the deployment by checking the status of the pods:

```bash
kubectl get pods
```

This command will deploy `shared-pv`, `shared-pvc`, `extractor-service`, and the StatefulSets. You should see one running pod and one pending pod.

## Test Zero Downtime

To monitor the status of all pods, open a terminal and run:

```bash
kubectl get pods
```

In another terminal, delete the running pod to test if the pending pod becomes active immediately after the running pod is terminated:

```bash
kubectl delete pod extractor-1-0-0
```

You will observe that the active pod is terminating, and then the pending pod becomes running.

By following these steps, you can test the zero downtime solution using Minikube and Kubernetes.