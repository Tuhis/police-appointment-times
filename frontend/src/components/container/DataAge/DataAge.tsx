import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectFreeSlotsAgeStatus, selectFreeSlotsUpdatedAt } from "../../../features/police/policeSlice";
import styles from "./DataAge.module.css";

const getMinutes = (updatedAt: Date): number => {
    const diffInMillis = Date.now() - updatedAt.getTime();
    const minutes = Math.round(diffInMillis / 1000 / 60);

    return minutes
}

export function DataAge() {
    const updatedAt = useAppSelector(selectFreeSlotsUpdatedAt);
    const updatedAtStatusR = useAppSelector(selectFreeSlotsAgeStatus);
    const [minutes, setMinutes] = useState(getMinutes(updatedAt));

    // "Copying" the status of updated at to component state is required to ensure that
    // 0-minutes is not shown briefly to users when loading the page/refreshing data.
    // React state update are asynchronous, so state.minutes field is updated only after the redux
    // store's status is updated to "idle"
    const [updatedAtStatus, setUpdatedAtStatus] = useState(updatedAtStatusR);

    useEffect(() => {
        setMinutes(getMinutes(updatedAt));
        setUpdatedAtStatus(updatedAtStatusR);

        const interval = setInterval(() => {
            setMinutes(getMinutes(updatedAt));
        }, 1000);

        return () => clearInterval(interval);
    }, [updatedAt, updatedAtStatusR]);

    return (
        <div className={styles["dataage-container"]}>
            {updatedAtStatus === 'idle' &&
                <span>
                    Tiedot päivitetty {minutes} minuuttia sitten.
                </span>
            }
            {updatedAtStatus === 'loading' &&
                <span>
                    Tietoja päivitetään...
                </span>
            }
            {updatedAtStatus === 'failed' &&
                <span>
                    Tietojen hakeminen epäonnistui.
                </span>
            }
        </div>
    );
}
