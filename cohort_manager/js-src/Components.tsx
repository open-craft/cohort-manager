import * as React from "react";

import { Cohort, Course } from "./Types";
import { tableStyle, cellStyle } from "./Styles";

export class CohortTable extends React.PureComponent<{ cohorts: Cohort[] }> {
  render() {
    let cohortsRows = [];
    for (let cohort of this.props.cohorts) {
      cohortsRows.push(
        <tr key={cohort.id}>
          <td style={cellStyle}>{cohort.name}</td>
          <td style={cellStyle}>{cohort.assignmentType}</td>
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
        <tbody>{cohortsRows}</tbody>
      </table>
    );
  }
}

interface CourseSelectProps {
  courses: Course[];
  onSelect: (event: any) => void;
  value: string;
}

export class CourseSelect extends React.PureComponent<CourseSelectProps> {
  render() {
    const options = this.props.courses.map((course) => (
      <option key={course.courseId} value={course.courseId}>{course.name}</option>
    ));
    return (
      <select value={this.props.value} onChange={this.props.onSelect}>
        <option key="" value="">-- Choose Course --</option>
        {options}
      </select>
    );
  }
}
