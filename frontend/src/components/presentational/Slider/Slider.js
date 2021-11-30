import React from "react";
import PropTypes from "prop-types";
import styles from "./Slider.module.css";
import _ from "lodash";

export class Slider extends React.Component {

    constructor(props) {
        super();

        this.state = {
            value: props.value
        };

        this.handleChange = this.handleChange.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.value) {

            if (_.isNaN(Number(nextProps.value))) {
                console.log(nextProps.value);
                console.error("Invalid type! Expected number!");
            }

            return {
                value: nextProps.value
            };
        }

        return null;
    }

    handleChange(event) {
        let newValue = Number(event.target.value);

        if (_.isNaN(newValue)) {
            console.log("asd");
            return;
        }

        if (newValue > this.props.maxValue) {
            newValue = this.props.maxValue;

        } else if (newValue < this.props.minValue) {
            newValue = this.props.minValue;
        }

        this.props.onChange({
            value: newValue
        });

        this.setState({
            value: newValue
        });
    }

    render() {
        return (
            <div className={styles.slidercontainer}>
                <input type="range" min={this.props.minValue} max={this.props.maxValue} onChange={this.handleChange} value={this.state.value} className={styles.slider} />
            </div>
        );
    }
};

Slider.propTypes = {
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

Slider.defaultProps = {
    minValue: 1,
    maxValue: 100,
    value: 50,
    onChange: _.noop
};

export default Slider;
