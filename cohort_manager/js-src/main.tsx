import * as React from "react";
import * as ReactDOM from "react-dom";

import { CohortTable } from "./Components";
import { Cohort } from "./Types";
import { getCohorts } from "./utils";

interface CohortSettings {
  is_cohorted: boolean;
}

interface Props {}

interface State {
  status: string;
  this_course: string;
  from_course: string;
  this_cohorts: Cohort[];
  from_cohorts: Cohort[];
}

class CohortManager extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      status: "loading",
      this_course: null,
      from_course: "",
      this_cohorts: [],
      from_cohorts: [],
    };
  }

  handleFromCourseUpdate(event) {
    this.setState({ from_course: event.target.value });
  }

  populateFromCohorts() {
    getCohorts(this.state.from_course).then(
      (data: Cohort[]) => {
        this.setState((state, props) => {
          return { ...state, status: `loaded cohorts`, from_cohorts: data };
        });
      },
      (reason: any) => {
        this.setState((state, props) => {
          return { ...state, status: `failed: ${reason}` };
        });
      }
    );
  }

  componentDidMount() {
    const course_id: string = new URLSearchParams(window.location.search).get(
      "course_id"
    );
    console.log(course_id);

    fetch(`/api/cohorts/v1/settings/${course_id}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          this.setState((state, props) => {
            return { ...state, status: `failed: ${response.status}` };
          });
          return Promise.reject();
        }
      })
      .then((data: CohortSettings) => {
        this.setState((state, props) => {
          return { ...state, status: "loaded", this_course: course_id };
        });
        console.log(data);
        this.update_this_cohorts(course_id);
      });
  }

  update_this_cohorts(course_id: string) {
    getCohorts(course_id).then(
      (data: Cohort[]) => {
        this.setState((state, props) => {
          return { ...state, status: `loaded cohorts`, this_cohorts: data };
        });
      },
      (reason: any) => {
        this.setState((state, props) => {
          return { ...state, status: `failed: ${reason}` };
        });
      }
    );
  }

  async importCohorts() {
    // import cohorts from from_cohorts into this_course
    // sequentially, because there are no bulk cohort import methods
    const course_id = this.state.this_course;
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    const existing_cohort_names = this.state.this_cohorts.map(e => e.name);
    this.setState({ status: "IMPORT IN PROGRESS" });

    for (let cohort of this.state.from_cohorts) {
      // skip existing cohorts
      if (existing_cohort_names.indexOf(cohort.name) > -1) {
        continue;
      }
      let data = {
        name: cohort.name,
        assignment_type: cohort.assignment_type,
      };
      await fetch(`/api/cohorts/v1/courses/${course_id}/cohorts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": token,
        },
        body: JSON.stringify(data),
      })
        .then(response => {
          return response.text();
        })
        .then(text => {
          console.log(text);
        });
    }
    this.setState({ status: "IMPORT COMPLETE" });
    this.update_this_cohorts(course_id);
  }

  render() {
    const gridColumn = {
      gridColumn: 1 / 2,
      gridRow: 1,
    };

    const gridWrapper = {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridGap: "10px",
    };

    return (
      <div>
        <div>
          <h2>Cohort Importer</h2>
          <p>Status: {this.state.status}</p>
        </div>
        <div style={gridWrapper}>
          <div style={gridColumn}>
            <h3>{this.state.this_course}</h3>
            <p>Current cohorts:</p>
            <CohortTable cohorts={this.state.this_cohorts} />
          </div>
          <div style={gridColumn}>
            <p>Import cohorts from:</p>
            <p>
              <input
                type="text"
                placeholder="course-v1:edX+DemoX+Demo_Course"
                value={this.state.from_course}
                onChange={ev => this.handleFromCourseUpdate(ev)}
              />
              <button onClick={() => this.populateFromCohorts()}>
                Load cohorts list
              </button>
            </p>
            <p>
              <button onClick={() => this.importCohorts()}>
                Import cohorts into {this.state.this_course}
              </button>
            </p>
            <p>Cohorts to be imported:</p>
            <p>
              <CohortTable cohorts={this.state.from_cohorts} />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

// wait for the dom to load before attempting to render into the dom.
document.addEventListener("DOMContentLoaded", function(event) {
  ReactDOM.render(
    <CohortManager />,
    document.getElementById("cohort-manager-root")
  );
});
