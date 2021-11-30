import React from "react";
import _ from "lodash";
import styles from "./Breadcrumbs.module.css";

const Breadcrumbs = ({path}) => {

    const getPathString = () => {
        let pathString = "";

        if (_.isArray(path) && path.length > 0) {
            _.forEach(path, pathElement => {
                pathString += " > " + pathElement;
            });

        } else {
            pathString = "> ";
        }

        return pathString;
    }

    return (
        <div className={styles.breadcrumbs}>
            <p>{getPathString()}</p>
        </div>
    );
};

export default Breadcrumbs;
