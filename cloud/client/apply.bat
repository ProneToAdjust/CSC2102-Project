docker build -t client .
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl delete -f client-deployment.yaml
kubectl delete -f client-service.yaml
kubectl delete -f client-hpa.yaml
kubectl apply -f client-deployment.yaml
kubectl apply -f client-service.yaml
kubectl apply -f client-hpa.yaml