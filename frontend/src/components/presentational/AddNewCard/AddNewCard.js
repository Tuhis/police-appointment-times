import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import styles from "./AddNewCard.module.css";
import BaseCard from "../BaseCard/BaseCard";

const AddNewCard = props => {
    return (
        <BaseCard
            showTitle={false}
            minHeight={props.minHeight}
            autoHeight={props.autoHeight}
            autoWidth={props.autoWidth} >

            <div
                onClick={props.onClick}
                className={styles.container}>
                <div className={styles.icon}>
                    +
                </div>
                <div className={styles.text}>
                    {props.title}
                </div>
            </div>

        </BaseCard>
    );
};

AddNewCard.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    minHeight: PropTypes.number,
    autoHeight: PropTypes.bool,
    autoWidth: PropTypes.bool
};

AddNewCard.defaultProps = {
    title: "Add New",
    onClick: _.noop,
    autoWidth: false
};

export default AddNewCard;
