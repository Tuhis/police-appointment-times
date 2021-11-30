import React from "react";
import styles from "./NormalButton.module.css";
import _ from "lodash";

const NormalButton = props => {

    const onClick = () => {
        console.log("btn clicked");

        if (props.onClick) {
            props.onClick();
        }
    }

    let className = styles["normal-button"];

    if (_.get(props, "css.cancelButton", false)) {
        className += " " + styles["cancel-button"];
    }

    return (
        <button
            type={"button"}
            className={className}
            onClick={onClick}>

            {props.children}
        </button>
    );
};

export default NormalButton;
