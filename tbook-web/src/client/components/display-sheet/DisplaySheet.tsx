import * as React from 'react'
import './DisplaySheet.scss'
import {DisplaySheetPresenter} from "../../../business/sheets/DisplaySheet/DisplaySheet.presenter";
import {useEffect, useState} from "react";
import {DisplaySheetViewmodel, SheetViewComponent} from "../../../business/sheets/DisplaySheet/DisplaySheet.viewmodel";

const displaySheetPresenter = new DisplaySheetPresenter()

export const DisplaySheet = () => {
    const [viewmodel, setViewmodel] = useState<DisplaySheetViewmodel>()
    displaySheetPresenter.setCallback(setViewmodel)

    useEffect(() => {
        displaySheetPresenter.Load()
    }, [])

    if (viewmodel == undefined){
        return (<h2>Loading...</h2>)
    }

    function viewComponentToHtml(viewComponent: SheetViewComponent) {
        switch (viewComponent.type){
            case "text":
                return <span> {viewComponent.text} </span>
            case "field":
                return <input type="text" placeholder={viewComponent.hint}/>
        }
    }
    const sheetContent = <p>{viewmodel.components.map(c => viewComponentToHtml(c))}</p>;

    return (
        <div className="container">
            <div className="m-2">
                <h2>{viewmodel.title}</h2>
                {sheetContent}
            </div>
        </div>
    )
}






