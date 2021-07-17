import React from 'react';
import { NamespacedPods, PodResource } from '../util/types';

const PodsComponent = (props: Props): JSX.Element => {
  return (
    <>
      {props.selectedNamespace !== '' && <h3>Pods:</h3>}
      <div className="pods">
        {props.selectedNamespace !== '' &&
          props.namespacedPods[props.selectedNamespace].map((pod, idx) => {
            return (
              <div
                key={idx}
                className={pod === props.selectedPod ? 'pod-selected' : 'pod'}
                onClick={() => props.setSelectedPod(pod)}
              >
                {pod.name}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PodsComponent;

interface Props {
  namespacedPods: NamespacedPods;
  selectedNamespace: string;
  selectedPod?: PodResource;
  setSelectedPod: (pod: PodResource) => void;
}
