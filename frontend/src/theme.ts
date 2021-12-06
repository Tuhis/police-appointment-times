import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#fff"
        }
    },
    components: {
        MuiFormLabel: {
            styleOverrides: {
                root: {
                   color: "#fff"
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: "#fff"
                },
                notchedOutline: {
                    borderColor: "rgba(255,255,255,0.47) !important"
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    color: "#fff",
                    "::before": {
                        borderBottomColor: "rgba(255,255,255,0.83) !important"
                    },
                    margin: "6 0"
                }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: "rgba(255,255,255,0.83)"
                }
            }
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginBottom: "12px"
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(19, 84, 168,1)",
                },
                label: {
                    color: "rgba(255,255,255,1)"
                }
            }
        }
    }
});
