import React from "react";
import styles from "./KeyValueList.module.css";
import _ from "lodash";

const KeyValueList = props => {

    const renderKeyValuePairs = data => {
        return _.map(data, item => {
            return (
                <div
                    className={styles.row}
                    key={item.key} >
                    <div className={styles.key}>
                        {item.key + ":"}
                    </div>
                    <div className={styles.value}>
                        {item.value}
                    </div>
                </div>
            );
        })
    };

    let className = styles["key-value-list"];

    if (props.className) {
        className += " " + props.className;
    }

    return (
        <div className={className}>
            {renderKeyValuePairs(props.data)}
        </div>
    );
};

export default KeyValueList;
