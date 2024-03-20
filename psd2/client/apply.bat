docker build -t client .
kubectl delete -f https://raw.githubusercontent.com/pythianarora/total-practice/master/sample-kubernetes-code/metrics-server.yaml
kubectl delete -f client-deployment.yaml
kubectl delete -f client-service.yaml
kubectl delete -f client-hpa.yaml
kubectl create -f https://raw.githubusercontent.com/pythianarora/total-practice/master/sample-kubernetes-code/metrics-server.yaml
kubectl apply -f client-deployment.yaml
kubectl apply -f client-service.yaml
kubectl apply -f client-hpa.yaml