import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import styles from "./Dropdown.module.css";

class Dropdown extends React.Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();

        this.state = {
            open: false,
            selectedItemIndex: this.props.selectedItemIndex
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.selectedItemIndex !== prevState.selectedItemIndex) {
            return {
                selectedItemIndex: nextProps.selectedItemIndex
            };
        }

        return null;
    }

    componentDidMount() {
        // Add an event listener to whole page so we know when mouse click happens outside the dropdown
        // Does not work for iOS touch screen
        document.addEventListener("click", this.handleDocumentClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleDocumentClick, false);
    }

    handleDocumentClick (e) {
        // On Edge this.ref.current is null sometimes... strange.
        if (this.ref.current === null || this.ref.current.contains(e.target)) {
            // Click in this component, dont do anything.
            return;
        }

        if (this.state.open) {
            this.toggleDropdown();
        }
    }

    toggleDropdown() {
        this.setState({
            open: !this.state.open
        });
    }

    selectItem(id, item) {
        this.props.onChange(item, id);

        this.setState({
            selectedItemId: id
        });
    }

    renderMenuItems() {
        return _.map(this.props.data, (item, id) => {
            return (
                <li
                    onClick={this.selectItem.bind(this, id, item)}
                    key={id} >
                    <span>{item.label}</span>
                </li>
            );
        });
    }

    render() {

        const selectedItem = _.get(this.props.data, [this.state.selectedItemIndex, "label"], "No data");

        return (
            <div
                ref={this.ref}
                className={styles.dropdown}
                onClick={this.toggleDropdown}>

                <div className={styles.header}>
                    <div className={styles["selected-item"]}>
                        {selectedItem}
                    </div>

                    <div className={styles.arrow}>
                        <div className={styles["arrow-image"]} />
                    </div>
                </div>

                {this.state.open &&
                    <div className={styles["item-list"]}>
                        <ul>
                            {this.renderMenuItems()}
                        </ul>
                    </div>
                }
            </div>

        );
    }
};

Dropdown.propTypes = {
    data: PropTypes.array.isRequired,
    selectedItemIndex: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

Dropdown.defaultProps = {
    data: [],
    selectedItemIndex: 0,
    onChange: _.noop
};

export default Dropdown;
