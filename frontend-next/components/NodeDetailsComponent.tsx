import React from 'react';
import ObjectComponent from './ObjectComponent';
import { Node } from './types';

const NodeDetailsComponent = (props: Props): JSX.Element => {
  return (
    <>
      {props.selectedNode != null && <h3>Node Details:</h3>}
      {props.selectedNode != null && (
        <div className="node-details">
          <div>
            <b>Name:</b> {props.selectedNode?.name}
          </div>
          <ObjectComponent title="Status" objectToDisplay={props.selectedNode?.status.nodeInfo} />
          <ObjectComponent title="CPU" objectToDisplay={props.selectedNode?.cpu} />
          <ObjectComponent title="Memory" objectToDisplay={props.selectedNode?.memory} />
        </div>
      )}
    </>
  );
};

export default NodeDetailsComponent;

interface Props {
  selectedNode?: Node;
}
