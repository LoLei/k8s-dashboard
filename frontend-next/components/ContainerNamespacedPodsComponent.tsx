import React, { useState } from 'react';

import { NamespacedPods, PodResource } from '../util/types';

import NamespacesComponent from './NamespacesComponent';
import PodsComponent from './PodsComponent';
import PodDetailsComponent from './PodDetailsComponent';

const ContainerNamespacedPodsComponent = (props: Props): JSX.Element => {
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');
  const [selectedPod, setSelectedPod] = useState<PodResource | undefined>(undefined);

  return (
    <>
      <NamespacesComponent
        namespacedPods={props.namespacedPods}
        selectedNamespace={selectedNamespace}
        setSelectedNamespace={setSelectedNamespace}
      />

      <PodsComponent
        namespacedPods={props.namespacedPods}
        selectedNamespace={selectedNamespace}
        selectedPod={selectedPod}
        setSelectedPod={setSelectedPod}
      />

      <PodDetailsComponent selectedPod={selectedPod} />
    </>
  );
};

export default ContainerNamespacedPodsComponent;

interface Props {
  namespacedPods: NamespacedPods;
}
