import * as React from 'react'
import './DisplaySheet.scss'
import {DisplaySheetPresenter} from "../../../business/sheets/DisplaySheet/DisplaySheet.presenter";
import {useEffect, useState} from "react";
import {DisplaySheetViewmodel} from "../../../business/sheets/DisplaySheet/DisplaySheet.viewmodel";

const displaySheetPresenter = new DisplaySheetPresenter()

export const DisplaySheet = () => {
    const [viewmodel, setViewmodel] = useState<DisplaySheetViewmodel>(undefined)
    displaySheetPresenter.setCallback(setViewmodel)

    useEffect(() => {
        displaySheetPresenter.Load()
    }, [])

    if (viewmodel == undefined){
        return (<h2>Loading...</h2>)
    }

    return (
        <div className="header-root w-100">
            <h2>{}</h2>
        </div>
    )
}






