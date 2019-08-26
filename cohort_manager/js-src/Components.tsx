import * as React from "react";

import { Cohort } from './Types';

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  border: '1px solid',
};

const cellStyle: React.CSSProperties = {
  border: '1px solid',
  padding: '5px',
};

export class CohortTable extends React.PureComponent<{cohorts: Cohort[]}> {
    render() {
      let cohorts_rows = [];
      for (let cohort of this.props.cohorts) {
          cohorts_rows.push(
              <tr key={cohort.id}>
                  <td style={cellStyle}>{cohort.name}</td>
                  <td style={cellStyle}>{cohort.assignment_type}</td>
              </tr>
          );
      }

      return (
        <table style={tableStyle}>
          <thead>
          <tr>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Assignment</th>
          </tr>
          </thead>
          <tbody>
          {cohorts_rows}
          </tbody>
        </table>
      );
    }
}
