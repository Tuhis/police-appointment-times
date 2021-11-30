import React from "react";
import styles from "./Row50.module.css";
import _ from "lodash";

const Row50 = props => {

    return (
        <div className={styles.row}>
            <div className={styles.col}>
                {_.get(props.children, 0, null)}
            </div>
            <div className={styles.col}>
                {_.get(props.children, 1, null)}
            </div>
        </div>
    );
};

export default Row50;
