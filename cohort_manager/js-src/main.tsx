import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CohortTable, CourseSelect } from './Components';
import { Cohort, Course } from './Types';
import { getCohorts, getCourses } from './utils';

interface Props {}

interface CourseData {
  courseId: string;
  cohorts: Cohort[];
}

interface State {
  // free text status field shown to the user
  status: string;
  intoCourse: CourseData;
  fromCourse: CourseData;
  // All course ids on the instance
  courses: Course[];
}

enum CourseType {
  IntoCourse = 'intoCourse',
  FromCourse = 'fromCourse',
}

class CohortManager extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      status: 'loading',
      intoCourse: {courseId: '', cohorts: []},
      fromCourse: {courseId: '', cohorts: []},
      courses: [],
    };
  }

  async componentDidMount() {
    const courses = await getCourses();
    this.setState({
      courses,
      status: 'loaded',
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
      let stateUpdates = {status: 'loaded'};
      stateUpdates[courseType] = {
        courseId: this.state[courseType].courseId,
        cohorts: [],
      };
      this.setState(stateUpdates);
      return;
    }

    getCohorts(this.state[courseType].courseId).then(
      (data: Cohort[]) => {
        let stateUpdates = {status: 'loaded cohorts'};
        stateUpdates[courseType] = {
          courseId: this.state[courseType].courseId,
          cohorts: data,
        };
        this.setState(stateUpdates);
      },
      (reason: any) => {
        this.setState({ status: `failed: ${reason}` });
      }
    );
  }

  onCourseChange(courseType: CourseType, event: any) {
    let stateUpdates = {};
    stateUpdates[courseType] = {
      courseId: event.target.value,
      cohorts: this.state[courseType].cohorts
    };
    this.setState(stateUpdates);
  }

  async importCohorts() {
    console.log(this.state);
    // import cohorts from fromCourse into intoCourse
    // sequentially, because there are no bulk cohort import methods
    const courseId = this.state.intoCourse.courseId;
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );

    const existingCohortNames = this.state.intoCourse.cohorts.map(e => e.name);
    this.setState({ status: 'IMPORT IN PROGRESS' });

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
    this.setState({ status: 'IMPORT COMPLETE' });
    this.updateCohorts(CourseType.IntoCourse);
  }

  render() {
    const gridColumnStyle = {
      gridColumn: 1 / 2,
      gridRow: 1,
    };

    const gridWrapperStyle = {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: '10px',
    };

    return (
      <div>
        <div>
          <h2>Cohort Importer</h2>
          <p>Status: {this.state.status}</p>
        </div>
        <div style={gridWrapperStyle}>
          <div style={gridColumnStyle}>
            <h3>{this.state.intoCourse.courseId}</h3>
            <CourseSelect
              courses={this.state.courses}
              onSelect={((e) => this.onCourseChange(CourseType.IntoCourse, e)).bind(this)}
              value={this.state.intoCourse.courseId}
            />
            <p>Current cohorts:</p>
            <CohortTable cohorts={this.state.intoCourse.cohorts} />
          </div>
          <div style={gridColumnStyle}>
            <p>Import cohorts from:</p>
            <CourseSelect
              courses={this.state.courses}
              onSelect={((e) => this.onCourseChange(CourseType.FromCourse, e)).bind(this)}
              value={this.state.fromCourse.courseId}
            />
            <p>
              <button onClick={() => this.importCohorts()}>
                Import cohorts into {this.state.intoCourse.courseId}
              </button>
            </p>
            <p>Cohorts to be imported:</p>
            <p>
              <CohortTable cohorts={this.state.fromCourse.cohorts} />
            </p>
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
