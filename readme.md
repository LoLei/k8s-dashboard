# k8s-dashboard

Simple and lightweight Kubernetes dashboard similar to Grafana, Lens, Headlamp, etc. (but with far
fewer features), for my personal use.

Deployed at: [k8s-dashboard.lolei.dev](https://k8s-dashboard.lolei.dev)

## Technology

Only a few tools are needed to make this work, on any cluster.  
I may talk about this more in an upcoming [blog](https://lolei.dev/posts) post.

### Backend

Instead of sending raw requests to the Kubernetes API, a client wrapper is used.

The backend has been implemented with (so far):

- Javascript (Typescript) client: [kubernetes-client-js](https://github.com/kubernetes-client/javascript) (currently deployed)
  - Most everything works out of the box, enjoyable experience.
- Rust client: [kube-rs](https://github.com/clux/kube-rs)
  - Particularly the [topNodes](https://github.com/kubernetes-client/javascript/blob/6b713dc83f494e03845fca194b84e6bfbd86f31c/src/top.ts#L20)
    function from the JS client had to be re-implemented, to get node-wide resources. (This would
    not have been necessary if the metrics API was supported.)
  - Resources are represented in [Quantities](https://docs.rs/k8s-openapi/0.12.0/k8s_openapi/apimachinery/pkg/api/resource/struct.Quantity.html),
    which are byte strings. The `AsInt64()` function was apparently not ported from Go, therefore
    doing arithmetic with human-readable bytes strings got a tad ugly as well.
  - The default non-cluster deployment via the kube config file does not work and needs a [separate user](https://github.com/kube-rs/kube-rs/issues/196).
  - Overall a less enjoyable experience.

The backend can be easily swapped out by defining a different hostname for the internal backend
service in the frontend configmap.

To view pods and nodes within a pod in the cluster, a different serviceaccount than the default one
was created and assigned to the pod, along with a clusterrole and clusterrolebinding granting the
correct RBAC permissions (see the k8s directory). **Cluster**role because nodes are not namespaced,
and pods in other namespaces should be viewable as well.

### Frontend

Next.js with its [API routes](https://nextjs.org/docs/api-routes/introduction) is used in order to
be able to access the cluster-internal backend service. The UI will (probably) be improved, however
it works reasonably well already (both on desktop and mobile, though if anyone ever wants to view
this on a phone is questionable).

## Screenshot

![Screenshot 2021-07-18 at 15-32-31 k8s-dashboard](https://user-images.githubusercontent.com/9076894/126069024-5eeca188-4c37-49b5-be63-9c2eae75647b.png)

<sup>This screenshot may be out of date.</sup>
