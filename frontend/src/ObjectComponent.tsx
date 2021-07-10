import React from 'react';

const ObjectComponent = (props: Props): JSX.Element => {
  return (
    <div>
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
    </div>
  );
};

export default ObjectComponent;

interface Props {
  title: string;
  objectToDisplay: object;
}
