import React from "react";
import PropTypes from "prop-types";
import { ResizeSensor } from "css-element-queries";
import styles from "./BigLinkList.module.css";
import Divider from "../Divider/Divider";

class BigLinkList extends React.Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();

        this.state = {
            widthAvailable: false
        };
    }

    componentDidMount() {
        this.setState({
            widthAvailable: true
        });

        new ResizeSensor(this.ref.current, () => {
            this.forceUpdate();
        });
    }

    createLinks() {
        const links = this.props.links.map(link => {
            let linkText;

            if (this.props.cutTextsOnNarrowList)
                linkText = this.ref.current.clientWidth > 100 ? link.text : link.text.substring(0,1);
            else
                linkText = link.text;

            return (
                <div
                    key={link.text}
                    onClick={link.onClick} >

                    <div className={`${styles["link-text"]} ${this.props.rotateTextsOnNarrowList ? styles["rotate"] : ""}`}>
                        {linkText}
                    </div>

                    <Divider />
                </div>
            )
        });

        links.unshift((<Divider key={"first-divider"}/>));

        return links;
    }

    render() {
        return (
            <div
                ref={this.ref}
                className={styles["big-link-list"]}>
                {this.state.widthAvailable &&
                    this.createLinks()}
            </div>

        );
    }
};

BigLinkList.propTypes = {
    cutTextsOnNarrowList: PropTypes.bool.isRequired,
    rotateTextsOnNarrowList: PropTypes.bool.isRequired
};

BigLinkList.defaultProps = {
    cutTextsOnNarrowList: false,
    rotateTextsOnNarrowList: false
};

export default BigLinkList;
