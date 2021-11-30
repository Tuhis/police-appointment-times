import React from "react";
import styles from "./Divider.module.css";

const Divider = props => {

    let className = styles.divider + " divider";

    if (props.className) {
        className += " " + props.className;
    }

    return (
        <div className={className} />
    );
};

export default Divider;
