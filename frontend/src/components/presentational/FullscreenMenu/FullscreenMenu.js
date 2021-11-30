import React from "react";
import styles from "./FullscreenMenu.module.css";
import { Centerizer } from "../Centerizer/Centerizer";

export class FullscreenMenu extends React.Component {

    state = {
        open: false
    };

    render() {
        return (
            <React.Fragment>
                <div
                    className={styles.menubutton}
                    onClick={() => this.setState({ open: true })}>

                    <div className={styles["menu-icon"]}>
                        <div />
                        <div />
                        <div />
                    </div>
                </div>

                {
                    this.state.open &&
                    <div
                        className={styles["fullscreen-container"]}
                        onClick={() => this.setState({ open: false })}>

                        <Centerizer
                            horizontal>
                            {/* TODO: Wrap children in container div and set max and min width on it */}
                            {this.props.children}
                        </Centerizer>
                    </div>
                }
            </React.Fragment>
        );
    }
};
