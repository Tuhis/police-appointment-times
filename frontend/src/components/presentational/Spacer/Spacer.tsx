type SpacerProps = {} & typeof defaultProps

const defaultProps = {
    height: "100px"
}

export function Spacer(props: SpacerProps) {
    return (
        <div style={{
            height: props.height
        }} />
    )
}
