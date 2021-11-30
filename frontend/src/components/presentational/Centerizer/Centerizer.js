import React from "react";
import _ from "lodash";
import styles from "./Centerizer.module.css";

export function Centerizer(props) {
    return (
        <div className={`${styles.centerizer} ${props.vertical ? styles.vertical : ""} ${props.horizontal ? styles.horizontal : ""}`}>
            {<div className={styles.content}>{props.children}</div>}
        </div>
    );
}

Centerizer.defaultProps = {
    vertical: false,
    horizontal: false
};
