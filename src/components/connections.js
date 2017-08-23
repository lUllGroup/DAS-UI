import React from 'react';
// import classnames from 'classnames';
// import get from 'lodash.get';
import { connect } from 'react-redux';

import { GRID_SIZE } from '../constants';

const Connections = ({ connections, gridWidthCount, gridHeightCount }) => {
  return (
    <svg width={gridWidthCount * GRID_SIZE} height={gridHeightCount * GRID_SIZE} className="connections">
      {connections.map(({ id, fromPosition, toPosition }) => {
        return (
          <line
            className="connection"
            key={id}
            x1={fromPosition.x * GRID_SIZE}
            y1={fromPosition.y * GRID_SIZE - GRID_SIZE / 2}
            x2={toPosition.x * GRID_SIZE}
            y2={toPosition.y * GRID_SIZE + GRID_SIZE / 2}
          />
        );
      })}
    </svg>
  );
};

const mapStateToProps = state => {
  return {
    connections: state
      .getIn(['graph', 'connections'])
      .map(connection => {
        const fromBlock = state.getIn(['graph', 'blocks', connection.get('fromId')]);
        const toBlock = state.getIn(['graph', 'blocks', connection.get('toId')]);

        const fromSpec = state.getIn(['blockSpecs', fromBlock.get('name')]);
        const toSpec = state.getIn(['blockSpecs', toBlock.get('name')]);

        const fromPosition = {
          x: fromBlock.getIn(['position', 'x']),
          y:
            fromBlock.getIn(['position', 'y']) -
            (fromSpec.inputs.length - fromSpec.inputs.indexOf(connection.get('fromInput')) - 1)
        };

        const toPosition = {
          x: toBlock.getIn(['position', 'x']),
          y: toBlock.getIn(['position', 'y']) + (toSpec.outputs.indexOf(connection.get('toOutput')) + 1)
        };

        return { id: connection.get('id'), fromPosition, toPosition };
      })
      .valueSeq()
      .toJS()
  };
};

export default connect(mapStateToProps)(Connections);
