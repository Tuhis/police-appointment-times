import _ from "lodash"
import styles from "./ButtonWithData.module.css";

type ButtonWithDataProps = {
    label: string;
} & typeof defaultProps

const defaultProps = {
    data: "",
    onClick: _.noop
}

const ButtonWithData = (props: ButtonWithDataProps) => {
    return (
        <div className={styles.container} onClick={props.onClick}>
            <div className={styles.label}>
                {props.label}
            </div>
            <div className={styles.data}>
                    {props.data}
            </div>
        </div>
    );
}

ButtonWithData.defaultProps = defaultProps;

export default ButtonWithData;
