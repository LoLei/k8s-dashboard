# k8s-dashboard

Simple and lightweight Kubernetes dashboard similar to Grafana, Lens, Headlamp, etc. (but with far fewer features), for my personal use.

Deployed at: https://k8s-dashboard.lolei.dev

## Technology
Only a few tools are needed to make this work, on any cluster.

## Backend
Instead of sending raw requests to the Kubernetes API, the official [Javascript (TS) client](https://github.com/kubernetes-client/javascript) is used.  
The backend can be easily swapped out by defining a different hostname in the frontend configmap.  
I plan on testing some other libraries as well, including [kube-rs](https://github.com/clux/kube-rs).

To view pods and nodes within a pod in the cluster, a different serviceaccount than the default one was created and assigned to the pod, along with a clusterrole and clusterrolebinding granting the correct RBAC permissions (see the k8s directory). **Cluster**role because nodes are not namespaced, and pods in other namespaces should be viewable as well.

## Frontend
Next.js with its [API routes](https://nextjs.org/docs/api-routes/introduction) is used in order to be able to access the cluster-internal backend service.  
The UI will (probably) be improved.

## Screenshot

![2021-07-15_19-02](https://user-images.githubusercontent.com/9076894/125828139-13162cd0-cd3e-44bc-b40f-0864338721d7.png)
