import * as React from 'react'
import './Navbar.scss'
import {FC} from "react";
import CloseIcon from '@material-ui/icons/Close';
import {IconButton} from "@material-ui/core";

export const Navbar: FC<NavbarOptions> = (props) => {
    return (
        <div className="header-root w-100">
            <div className="container h-100 d-flex align-items-center justify-content-between">
                <h2 className="">{props.title}</h2>
                <IconButton style={{color: "white"}}><CloseIcon fontSize="large" ></CloseIcon></IconButton>
            </div>
        </div>
    )
}

export interface NavbarOptions {
    title?: string;
    addressOnClose?: string;
}





