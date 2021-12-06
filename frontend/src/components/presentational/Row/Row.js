import React from "react";
import styles from "./Row.module.css";
import _ from "lodash";

const Row = props => {

    return (
        <div className={styles.row}>
            <div className={styles.col}>
                {props.children}
            </div>
        </div>
    );
};

export default Row;
