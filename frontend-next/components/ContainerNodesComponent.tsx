import React, { useState } from 'react';

import { Node } from '../util/types';

import NodesComponent from './NodesComponent';
import NodeDetailsComponent from './NodeDetailsComponent';

const ContainerNodesComponent = (props: Props): JSX.Element => {
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

  return (
    <>
      <NodesComponent
        nodes={props.nodes}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />

      <NodeDetailsComponent selectedNode={selectedNode} />
    </>
  );
};

export default ContainerNodesComponent;

interface Props {
  nodes: Node[];
}
