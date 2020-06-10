import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CohortTable, CourseSelect, Spinner } from './Components';
import { Cohort, Course } from './Types';
import { getCohorts, getCourses } from './utils';

interface Props {}

interface CourseData {
  courseId: string;
  cohorts: Cohort[];
}

interface State {
  busy: boolean;  // whether loading, etc. is happening in the background
  intoCourse: CourseData;
  fromCourse: CourseData;
  courses: Course[];   // All course ids on the instance
}

enum CourseType {
  IntoCourse = 'intoCourse',
  FromCourse = 'fromCourse',
}

class CohortManager extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      busy: true,
      intoCourse: {courseId: '', cohorts: []},
      fromCourse: {courseId: '', cohorts: []},
      courses: [],
    };
  }

  async componentDidMount() {
    const courses = await getCourses();
    this.setState({
      courses,
      busy: false,
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.intoCourse.courseId !== this.state.intoCourse.courseId) {
      this.updateCohorts(CourseType.IntoCourse);
    }
    if (prevState.fromCourse.courseId !== this.state.fromCourse.courseId) {
      this.updateCohorts(CourseType.FromCourse);
    }
  }

  updateCohorts(courseType: CourseType) {
    if (this.state[courseType].courseId === '') {
      let stateUpdates = { busy: false };
      stateUpdates[courseType] = {
        courseId: this.state[courseType].courseId,
        cohorts: [],
      };
      this.setState(stateUpdates);
      return;
    }

    this.setState({busy: true});
    getCohorts(this.state[courseType].courseId).then(
      (data: Cohort[]) => {
        let stateUpdates = { busy: false };
        stateUpdates[courseType] = {
          courseId: this.state[courseType].courseId,
          cohorts: data,
        };
        this.setState(stateUpdates);
      },
      (reason: any) => {
        this.setState({ busy: false });
      }
    );
  }

  onCourseChange(courseType: CourseType, event: any) {
    // Updates the state when a course is selected. Actual work is triggered in
    // componentDidUpdate.
    let stateUpdates = {};
    stateUpdates[courseType] = {
      courseId: event.target.value,
      cohorts: this.state[courseType].cohorts
    };
    this.setState(stateUpdates);
  }

  async importCohorts() {
    console.log(this.state); // debug
    // import cohorts from fromCourse into intoCourse
    // sequentially, because there are no bulk cohort import methods
    this.setState({ busy: true });
    const courseId = this.state.intoCourse.courseId;
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    const existingCohortNames = this.state.intoCourse.cohorts.map(e => e.name);

    for (let cohort of this.state.fromCourse.cohorts) {
      // skip existing cohorts
      if (existingCohortNames.indexOf(cohort.name) > -1) {
        continue;
      }
      let data = {
        name: cohort.name,
        assignment_type: cohort.assignmentType,
      };
      await fetch(`/api/cohorts/v1/courses/${courseId}/cohorts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': token,
        },
        body: JSON.stringify(data),
      })
        .then(response => {
          // TODO error handling
          return response.text();
        })
        .then(text => {
          console.log(text);
        });
    }

    this.setState({ busy: false });
    this.updateCohorts(CourseType.IntoCourse);
  }

  private isReadyToImport(): boolean {
    // We are ready to run an import/copy if both courses' information is
    // loaded and they aren't both the same course.
    return (
      this.state.intoCourse.courseId !== ''
      && this.state.fromCourse.courseId !== ''
      && !this.state.busy
      && this.state.intoCourse.courseId !== this.state.fromCourse.courseId
    );
  }

  render() {
    const gridColumnStyle = {
      gridColumn: 2 / 5,
      gridRow: 1,
    };

    const btnGridColumnStyle = {
      gridColumn: 1 / 5,
      gridRow: 1,
    };

    const gridWrapperStyle = {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 2fr',
      gridGap: '10px',
    };

    return (
      <div>
        {this.state.busy ? <Spinner /> : null}
        <h2 style={{marginBottom: '20px'}}>Cohort Importer</h2>
        <div style={gridWrapperStyle}>
          <div style={gridColumnStyle}>
            <h3>From Course</h3>
            <CourseSelect
              courses={this.state.courses}
              onSelect={((e) => this.onCourseChange(CourseType.FromCourse, e)).bind(this)}
              value={this.state.fromCourse.courseId}
            />
            <h4>Cohorts to be imported:</h4>
            <CohortTable cohorts={this.state.fromCourse.cohorts} />
          </div>

          <div style={btnGridColumnStyle}>
            <button onClick={() => this.importCohorts()} disabled={!this.isReadyToImport()}>
              Copy cohorts ->
            </button>
          </div>

          <div style={gridColumnStyle}>
            <h3>Into Course</h3>
            <CourseSelect
              courses={this.state.courses}
              onSelect={((e) => this.onCourseChange(CourseType.IntoCourse, e)).bind(this)}
              value={this.state.intoCourse.courseId}
            />
            <h4>Current cohorts:</h4>
            <CohortTable cohorts={this.state.intoCourse.cohorts} />
          </div>
        </div>
      </div>
    );
  }
}

// wait for the dom to load before attempting to render into the dom.
document.addEventListener('DOMContentLoaded', function(event) {
  ReactDOM.render(
    <CohortManager />,
    document.getElementById('cohort-manager-root')
  );
});
