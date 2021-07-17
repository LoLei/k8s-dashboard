import React from 'react';
import { NamespacedPods } from '../util/types';

const NamespacesComponent = (props: Props): JSX.Element => {
  return (
    <>
      <h3>Namespaces:</h3>
      <div className="namespaces">
        {Object.keys(props.namespacedPods).map((ns, idx) => {
          return (
            <div
              key={idx}
              className={ns === props.selectedNamespace ? 'namespace-selected' : 'namespace'}
              onClick={() => props.setSelectedNamespace(ns)}
            >
              {ns}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NamespacesComponent;

interface Props {
  namespacedPods: NamespacedPods;
  selectedNamespace: string;
  setSelectedNamespace: (ns: string) => void;
}
