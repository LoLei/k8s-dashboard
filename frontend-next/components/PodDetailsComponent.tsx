import prettyMilliseconds from 'pretty-ms';
import React from 'react';
import { PodResource } from '../util/types';

const PodDetailsComponent = (props: Props): JSX.Element => {
  const getAgeInHours = (d: Date | undefined): string => {
    if (d == null) {
      return '?';
    }
    const diffMs = new Date().getTime() - new Date(d).getTime();
    return prettyMilliseconds(diffMs, { compact: true });
  };

  return (
    <>
      {props.selectedPod != null && <h3>Pod Details:</h3>}
      <div className="pod-details">
        {props.selectedPod != null && (
          <>
            <div>
              <b>Name:</b> {props.selectedPod?.name}
            </div>
            <div>
              <b>Node:</b> {props.selectedPod?.nodeName}
            </div>
            <div>
              <b>Containers:</b>
              <ul>
                {props.selectedPod?.spec.containerImages?.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <b>Phase:</b>{' '}
              <span
                className={
                  props.selectedPod?.status.phase === 'Running'
                    ? 'pod-status-phase-running'
                    : 'pod-status-phase-other'
                }
              >
                {props.selectedPod?.status.phase}
              </span>
            </div>
            <div>
              <b>Age:</b> {getAgeInHours(props.selectedPod?.status.startTime)}
            </div>
            <div>
              <b>Restarts:</b> {props.selectedPod?.status.restartCount}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PodDetailsComponent;

interface Props {
  selectedPod?: PodResource;
}
