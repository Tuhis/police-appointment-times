import React from "react";
import styles from "./Sidebar.module.css";

export class Sidebar extends React.Component {

    render() {
        return (
            <div className={styles.sidebar}>
                <div className={styles.logo} />
                {this.props.children}
            </div>
        );
    }
};
