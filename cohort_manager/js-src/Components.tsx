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
    const style = {
      marginBottom: '10px',
    };
    return (
      <select style={style} value={this.props.value} onChange={this.props.onSelect}>
        <option key="" value="">-- Choose Course --</option>
        {options}
      </select>
    );
  }
}


export class Spinner extends React.PureComponent<{}> {
  render() {
    const svgStyle: React.CSSProperties = {
      display: 'block',
      position: 'fixed',
      left: '50%',
      top: '25%',
      marginLeft: '-98px',
      marginTop: '-98px',
    };

    return (
      // source: https://loading.io/, used under https://loading.io/license/#free-license
      <svg xmlns="http://www.w3.org/2000/svg" style={svgStyle} width="196px" height="196px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="translate(80,50)">
        <g transform="rotate(0)">
        <circle cx="0" cy="0" r="6" fill="#ffa663" fill-opacity="1">
          <animateTransform attributeName="transform" type="scale" begin="-0.875s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
          <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.875s"></animate>
        </circle>
        </g>
        </g><g transform="translate(71.21320343559643,71.21320343559643)">
        <g transform="rotate(45)">
        <circle cx="0" cy="0" r="6" fill="#ffa663" fill-opacity="0.875">
          <animateTransform attributeName="transform" type="scale" begin="-0.75s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
          <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.75s"></animate>
        </circle>
        </g>
        </g><g transform="translate(50,80)">
        <g transform="rotate(90)">
        <circle cx="0" cy="0" r="6" fill="#ffa663" fill-opacity="0.75">
          <animateTransform attributeName="transform" type="scale" begin="-0.625s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
          <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.625s"></animate>
        </circle>
        </g>
        </g><g transform="translate(28.786796564403577,71.21320343559643)">
        <g transform="rotate(135)">
        <circle cx="0" cy="0" r="6" fill="#ffa663" fill-opacity="0.625">
          <animateTransform attributeName="transform" type="scale" begin="-0.5s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
          <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.5s"></animate>
        </circle>
        </g>
        </g><g transform="translate(20,50.00000000000001)">
        <g transform="rotate(180)">
        <circle cx="0" cy="0" r="6" fill="#ffa663" fill-opacity="0.5">
          <animateTransform attributeName="transform" type="scale" begin="-0.375s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
          <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.375s"></animate>
        </circle>
        </g>
        </g><g transform="translate(28.78679656440357,28.786796564403577)">
        <g transform="rotate(225)">
        <circle cx="0" cy="0" r="6" fill="#ffa663" fill-opacity="0.375">
          <animateTransform attributeName="transform" type="scale" begin="-0.25s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
          <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.25s"></animate>
        </circle>
        </g>
        </g><g transform="translate(49.99999999999999,20)">
        <g transform="rotate(270)">
        <circle cx="0" cy="0" r="6" fill="#ffa663" fill-opacity="0.25">
          <animateTransform attributeName="transform" type="scale" begin="-0.125s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
          <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.125s"></animate>
        </circle>
        </g>
        </g><g transform="translate(71.21320343559643,28.78679656440357)">
        <g transform="rotate(315)">
        <circle cx="0" cy="0" r="6" fill="#ffa663" fill-opacity="0.125">
          <animateTransform attributeName="transform" type="scale" begin="0s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
          <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="0s"></animate>
        </circle>
        </g>
        </g>
      </svg>
    );
  }
}
