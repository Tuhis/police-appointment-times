import React from "react";
import styles from "./CardAdjustmentRow.module.css";
import _ from "lodash";

const CardAdjustmentRow = props => {

    return (
        <div className={styles.row}>
            <div>
                {_.get(props.children, 0, null)}
            </div>
            <div>
                {_.get(props.children, 1, null)}
            </div>
        </div>
    );
};

export default CardAdjustmentRow;
