import classNames from "classnames";
import React from "react";
import styles from "./BaseBox.module.css";

type BaseBoxProps = {
    children?: React.ReactNode
} & typeof defaultProps

const defaultProps = {
    autoHeight: true,
    autoWidth: true,
    minHeight: 50,
    padSidesOnWidescreen: true
}

const BaseBox = (props: BaseBoxProps) => {

    const classes = classNames(
        styles.container,
        {
            [styles.basebox]: true,
            [styles["auto-height"]]: props.autoHeight,
            [styles["auto-width"]]: props.autoWidth,
            [styles["fixed-height"]]: !props.autoHeight,
            [styles["fixed-width"]]: !props.autoWidth,
            [styles["basebox-pad"]]: props.padSidesOnWidescreen,
        }
    );

    return (
        <div className={classes}
            style={{minHeight: props.minHeight}}>

            {props.children}
        </div>
    );
}

BaseBox.defaultProps = defaultProps;

export default BaseBox;
