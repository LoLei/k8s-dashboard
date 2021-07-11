import React from 'react';
import { NodeInfo, NodeResource } from './types';

/**
 * Displays the keys and values of an object in an <ul>
 */
const ObjectComponent = (props: Props): JSX.Element => {
  return (
    <>
      <b>{props.title}:</b>
      <ul>
        {Object.entries(props.objectToDisplay).map((it, idx) => {
          return (
            <li key={idx}>
              <b>{it[0]}:</b> {it[1]}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ObjectComponent;

interface Props {
  title: string;
  // objectToDisplay: Record<string, unknown>;
  objectToDisplay: NodeInfo | NodeResource;
}
