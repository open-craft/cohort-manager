RequireJS.define("cohort-manager", ["require", "exports", "react", "react-dom"], function (require, exports, React, ReactDOM) {
    console.trace(React);
    console.trace(ReactDOM);
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CohortManager extends React.Component {
        render() {
            return (React.createElement("div", null, "Hello!"));
        }
    }
    ReactDOM.render(React.createElement(CohortManager, null), document.getElementById("cohort-manager-root"));
});
