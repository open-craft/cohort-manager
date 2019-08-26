((define) => {var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("cohort-manager", ["require", "exports", "react", "react-dom"], function (require, exports, React, ReactDOM) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CohortManager extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                status: 'loading',
                this_course: null,
                from_course: '',
                this_cohorts: [],
                from_cohorts: [],
            };
        }
        handleFromCourseUpdate(event) {
            this.setState({ from_course: event.target.value });
        }
        populateFromCohorts() {
            const course_id = this.state.from_course;
            fetch(`/api/cohorts/v1/courses/${course_id}/cohorts/`).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    this.setState((state, props) => {
                        return Object.assign({}, state, { status: `failed: ${response.status}` });
                    });
                    return Promise.reject();
                }
            }).then((data) => {
                this.setState((state, props) => {
                    console.log(data);
                    return Object.assign({}, state, { status: `loaded cohorts`, from_cohorts: data });
                });
            });
        }
        componentDidMount() {
            const course_id = new URLSearchParams(window.location.search).get('course_id');
            console.log(course_id);
            fetch(`/api/cohorts/v1/settings/${course_id}`).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    this.setState((state, props) => {
                        return Object.assign({}, state, { status: `failed: ${response.status}` });
                    });
                    return Promise.reject();
                }
            }).then((data) => {
                this.setState((state, props) => {
                    return Object.assign({}, state, { status: 'loaded', this_course: course_id });
                });
                console.log(data);
                this.update_this_cohorts(course_id);
            });
        }
        update_this_cohorts(course_id) {
            fetch(`/api/cohorts/v1/courses/${course_id}/cohorts/`).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    this.setState((state, props) => {
                        return Object.assign({}, state, { status: `failed: ${response.status}` });
                    });
                    return Promise.reject();
                }
            }).then((data) => {
                this.setState((state, props) => {
                    console.log(data);
                    return Object.assign({}, state, { status: `loaded cohorts`, this_cohorts: data });
                });
            });
        }
        importCohorts() {
            return __awaiter(this, void 0, void 0, function* () {
                // import cohorts from from_cohorts into this_course
                // sequentially, because there are no bulk cohort import methods
                const course_id = this.state.this_course;
                const token = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                const existing_cohort_names = this.state.this_cohorts.map(e => e.name);
                this.setState({ status: 'IMPORT IN PROGRESS' });
                for (let cohort of this.state.from_cohorts) {
                    // skip existing cohorts
                    if (existing_cohort_names.indexOf(cohort.name) > -1) {
                        continue;
                    }
                    let data = {
                        name: cohort.name,
                        assignment_type: cohort.assignment_type,
                    };
                    yield fetch(`/api/cohorts/v1/courses/${course_id}/cohorts/`, { method: 'POST', headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': token,
                        },
                        body: JSON.stringify(data) }).then((response) => {
                        return response.text();
                    }).then((text) => { console.log(text); });
                }
                this.setState({ status: 'IMPORT COMPLETE' });
                this.update_this_cohorts(course_id);
            });
        }
        render() {
            console.log(this.state);
            let this_cohorts = [];
            for (let cohort of this.state.this_cohorts) {
                this_cohorts.push(React.createElement("li", { key: cohort.id }, cohort.name));
            }
            let from_cohorts = [];
            for (let cohort of this.state.from_cohorts) {
                from_cohorts.push(React.createElement("li", { key: cohort.id }, cohort.name));
            }
            return (React.createElement("div", null,
                React.createElement("div", null, this.state.status),
                React.createElement("h2", null, this.state.this_course),
                React.createElement("p", null, "Cohorts:"),
                React.createElement("ul", null, this_cohorts),
                React.createElement("hr", null),
                React.createElement("p", null, "Import cohorts from:"),
                React.createElement("input", { type: "text", value: this.state.from_course, onChange: (ev) => this.handleFromCourseUpdate(ev) }),
                React.createElement("button", { onClick: () => this.populateFromCohorts() }, "Load cohorts list"),
                React.createElement("ul", null, from_cohorts),
                React.createElement("button", { onClick: () => this.importCohorts() },
                    "Import cohorts into ",
                    this.state.this_course)));
        }
    }
    ReactDOM.render(React.createElement(CohortManager, null), document.getElementById("cohort-manager-root"));
});
}).call(this, define || RequireJS.define);
