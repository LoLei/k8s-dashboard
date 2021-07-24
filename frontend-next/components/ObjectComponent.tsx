import React from 'react';
import { NodeInfo, NodeResource } from '../util/types';
import prettyBytes from 'pretty-bytes';

/**
 * Displays the keys and values of an object in an <ul>
 */
const ObjectComponent = (props: Props): JSX.Element => {
  const formatValue = (value: number | string): string => {
    if (props.title == 'Status') {
      return value as string;
    }
    // TODO: Check whether the backend already returns the resource as a human readable string
    if (props.title === 'CPU') {
      return (value as number).toFixed(3);
    }
    if (props.title === 'Memory') {
      return prettyBytes(parseInt(value as string));
    }
  };

  return (
    <>
      <b>{props.title}:</b>
      <ul>
        {Object.entries(props.objectToDisplay).map((it, idx) => {
          return (
            <li key={idx}>
              <b>{it[0]}:</b> {formatValue(it[1])}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ObjectComponent;

interface Props {
  title?: 'CPU' | 'Memory' | 'Status';
  objectToDisplay: NodeInfo | NodeResource;
}
