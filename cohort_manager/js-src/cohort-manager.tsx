import * as React from "react";
import * as ReactDOM from "react-dom";

interface CohortSettings {
    is_cohorted: boolean,
}

interface Props {
}

interface Cohort {
    user_count: number,
    name: string,
    assignment_type: string,
    id: number,
    group_id: number,
    user_partition_id: number,
}

interface State {
    status: string,
    this_course: string,
    from_course: string,
    this_cohorts: Array<Cohort>,
    from_cohorts: Array<Cohort>,
}

class CohortManager extends React.Component<Props, State> {
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
        this.setState({from_course: event.target.value});
    }

    populateFromCohorts() {
        const course_id = this.state.from_course;

        fetch(`/api/cohorts/v1/courses/${course_id}/cohorts/`).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                this.setState((state, props) => {
                    return {...state, status: `failed: ${response.status}`};
                });
                return Promise.reject();
            }
        }).then((data: Array<Cohort>) => {
            this.setState((state, props) => {
                console.log(data);
                return {...state, status: `loaded cohorts`, from_cohorts: data};
            });
        });
    }

    componentDidMount() {
        const course_id: string = new URLSearchParams(window.location.search).get('course_id');
        console.log(course_id);

        fetch(`/api/cohorts/v1/settings/${course_id}`).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                this.setState((state, props) => {
                    return {...state, status: `failed: ${response.status}`};
                });
                return Promise.reject();
            }
        }).then((data: CohortSettings) => {
            this.setState((state, props) => {
                return {...state, status: 'loaded', this_course: course_id};
            });
            console.log(data);
            this.update_this_cohorts(course_id);
        });
    }

    update_this_cohorts(course_id: string) {
        fetch(`/api/cohorts/v1/courses/${course_id}/cohorts/`).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                this.setState((state, props) => {
                    return {...state, status: `failed: ${response.status}`};
                });
                return Promise.reject();
            }
        }).then((data: Array<Cohort>) => {
            this.setState((state, props) => {
                console.log(data);
                return {...state, status: `loaded cohorts`, this_cohorts: data};
            });
        });
    }

    async importCohorts() {
        // import cohorts from from_cohorts into this_course
        // sequentially, because there are no bulk cohort import methods
        const course_id = this.state.this_course;
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        const existing_cohort_names = this.state.this_cohorts.map(e => e.name);
        this.setState({status: 'IMPORT IN PROGRESS'});

        for (let cohort of this.state.from_cohorts) {
            // skip existing cohorts
            if (existing_cohort_names.indexOf(cohort.name) > -1) {
                continue;
            }
            let data = {
                name: cohort.name,
                assignment_type: cohort.assignment_type,
            };
            await fetch(`/api/cohorts/v1/courses/${course_id}/cohorts/`, {method: 'POST', headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': token,
                            },
                body: JSON.stringify(data)}).then((response) => {
                    return response.text();
            }).then((text) => {console.log(text);});
        }
        this.setState({status: 'IMPORT COMPLETE'});
        this.update_this_cohorts(course_id);
    }

    render() {
        console.log(this.state);
        let this_cohorts_rows = [];
        for (let cohort of this.state.this_cohorts) {
            this_cohorts_rows.push(
                <tr key={cohort.id}>
                    <td>{cohort.name}</td>
                    <td>{cohort.assignment_type}</td>
                </tr>
            );
        }

        let from_cohorts = [];
        for (let cohort of this.state.from_cohorts) {
            from_cohorts.push(<li key={cohort.id}>{cohort.name}</li>);
        }

        const gridColumn = {
            gridColumn: 1 / 2,
            gridRow: 1,
        };

        const gridWrapper = {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: '10px',
        };

        return (
            <div>
                <div>
                    <h2>Cohort Importer</h2>
                </div>
                <div style={gridWrapper}>
                    <div style={gridColumn}>
                        <h3>{this.state.this_course}</h3>
                        <p>Current cohorts:</p>
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Assignment</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this_cohorts_rows}
                            </tbody>
                        </table>
                    </div>
                    <div style={gridColumn}>
                        <p>Import cohorts from:</p>
                        <input type="text" placeholder="course-v1:edX+DemoX+Demo_Course" value={this.state.from_course} onChange={(ev) => this.handleFromCourseUpdate(ev)}/>
                        <button onClick={() => this.populateFromCohorts()}>Load cohorts list</button>
                        <ul>{from_cohorts}</ul>
                        <button onClick={() => this.importCohorts()}>Import cohorts into {this.state.this_course}</button>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<CohortManager/>, document.getElementById("cohort-manager-root"));
