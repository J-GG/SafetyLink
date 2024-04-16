import React from 'react';
import style from './AlertButton.module.css';
import {t} from "i18next";

interface AlertButtonProps {
    status: boolean;
    onClick: () => void;
}

const AlertButton = ({status, onClick}: AlertButtonProps): JSX.Element => {
    return (
        <div className={`${style.alertButtonContainer} ${status && style.alertOn}`}>
            <div className={style.button} onClick={onClick}>
                <div className={style.title}>SOS</div>
                <div className={style.description}>
                    {status ? t("home.alertButton.on.description") : t("home.alertButton.off.description")}
                </div>
            </div>
        </div>
    );
};

export default AlertButton;
