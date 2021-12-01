import _ from "lodash"
import styles from "./ButtonWithData.module.css";
import classNames from "classnames";
import { Centerizer } from "../Centerizer/Centerizer";
import React from "react";

type ButtonWithDataProps = {
    label: string;
} & typeof defaultProps

const defaultProps = {
    data: "",
    hideData: false,
    isButton: false,
    centerize: false,
    onClick: _.noop
}

const ButtonWithData = (props: ButtonWithDataProps) => {
    const classes = classNames(
        styles.container,
        {
            [styles.button]: props.isButton
        }
    );

    return (
        <div className={classes} onClick={props.onClick}>
            {/* TODO: Get rid of following repetition */}
            {props.centerize &&
                <Centerizer>
                <div className={styles.label}>
                    {props.label}
                </div>
                {!props.hideData &&
                <div className={styles.data}>
                        {props.data}
                </div>
                }
                </Centerizer>
            }
            {!props.centerize &&
                <React.Fragment>
                <div className={styles.label}>
                    {props.label}
                </div>
                {!props.hideData &&
                <div className={styles.data}>
                        {props.data}
                </div>
                }
                </React.Fragment>
            }
        </div>
    );
}

ButtonWithData.defaultProps = defaultProps;

export default ButtonWithData;
