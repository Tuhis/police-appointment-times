import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import styles from "./BaseCard.module.css";
import Divider from "../Divider/Divider";

import "./BaseCardOverride.css";
import BaseBox from "../BaseBox/BaseBox";
import { minWidth } from "@mui/material/node_modules/@mui/system";

const BaseCard = props => {
    return (
        <BaseBox
            autoHeight={props.autoHeight}
            autoWidth={props.autoWidth}
            minHeight={minWidth}
            padSidesOnWidescreen={props.padSidesOnWidescreen} >

            {props.showTitle &&
                <React.Fragment>
                    {props.editableTitle ?
                        <input
                            className={styles["title-input"]}
                            type="text"
                            value={props.title}
                            onChange={(e) => props.onTitleChange(e.target.value)} />
                        :
                        <h2 className={styles["h2-title"]}>{props.title}</h2>
                    }
                    <Divider className={styles.divider} />
                </React.Fragment>
            }

            {props.children}
        </BaseBox>
    );
};

BaseCard.propTypes = {
    title: PropTypes.string.isRequired,
    autoHeight: PropTypes.bool.isRequired,
    autoWidth: PropTypes.bool.isRequired,
    minHeight: PropTypes.number.isRequired,
    showTitle: PropTypes.bool.isRequired,
    editableTitle: PropTypes.bool.isRequired,
    padSidesOnWidescreen: PropTypes.bool.isRequired,
    onTitleChange: PropTypes.func
};

BaseCard.defaultProps = {
    title: "Card Title",
    autoHeight: false,
    autoWidth: true,
    minHeight: 0,
    showTitle: true,
    editableTitle: false,
    padSidesOnWidescreen: false,
    onTitleChange: _.noop
};

export default BaseCard;
