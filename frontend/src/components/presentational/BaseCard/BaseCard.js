import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import styles from "./BaseCard.module.css";
import Divider from "../Divider/Divider";

import "./BaseCardOverride.css";

const BaseCard = props => {
    return (
        <div className={
            styles.basecard +
            " base-card " +
            (props.autoHeight ? styles["auto-height"] : styles["fixed-height"]) + " " +
            (props.autoWidth ? styles["auto-width"] : styles["fixed-width"])}
            style={{minHeight: props.minHeight}} >

            {props.showTitle &&
                <React.Fragment>
                    {props.editableTitle ?
                        <input
                            className={styles["title-input"]}
                            type="text"
                            value={props.title}
                            onChange={(e) => props.onTitleChange(e.target.value)} />
                        :
                        <h2>{props.title}</h2>
                    }
                    <Divider className={styles.divider} />
                </React.Fragment>
            }

            {props.children}
        </div>
    );
};

BaseCard.propTypes = {
    title: PropTypes.string.isRequired,
    autoHeight: PropTypes.bool.isRequired,
    autoWidth: PropTypes.bool.isRequired,
    minHeight: PropTypes.number.isRequired,
    showTitle: PropTypes.bool.isRequired,
    editableTitle: PropTypes.bool.isRequired,
    onTitleChange: PropTypes.func.isRequired
};

BaseCard.defaultProps = {
    title: "Card Title",
    autoHeight: false,
    autoWidth: true,
    minHeight: 0,
    showTitle: true,
    editableTitle: false,
    onTitleChange: _.noop
};

export default BaseCard;
