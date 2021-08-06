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
    if (props.title === 'CPU') {
      return (Math.round((value as number) * 1000) / 1000).toString();
    }
    if (props.title === 'Memory') {
      return prettyBytes(parseInt(value as string));
    }
  };

  return (
    <>
      <b title={props.title === 'CPU' ? 'vCPU or millicpu' : ''}>{props.title}:</b>
      <ul>
        {Object.entries(props.objectToDisplay).map((it, idx) => {
          return (
            <li key={idx}>
              <b>{it[0]}:</b>
              <span title={it[1]}> {formatValue(it[1])}</span>
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
