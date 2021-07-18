import React from 'react';
import { Node } from '../util/types';

const NodesComponent = (props: Props): JSX.Element => {
  return (
    <>
      <h3>Nodes ({props.nodes.length})</h3>
      <div className="nodes">
        {props.nodes.map((node, idx) => {
          return (
            <div
              key={idx}
              className={node.name === (props.selectedNode?.name || '') ? 'node-selected' : 'node'}
              onClick={() => props.setSelectedNode(node)}
            >
              {node.name}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NodesComponent;

interface Props {
  nodes: Node[];
  selectedNode?: Node;
  setSelectedNode: (n?: Node) => void;
}
