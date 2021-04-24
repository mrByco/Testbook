import * as React from 'react'
import './DisplaySheet.scss'
import {DisplaySheetPresenter} from "../../../business/sheets/DisplaySheet/DisplaySheet.presenter";
import {useEffect, useState} from "react";
import {DisplaySheetViewmodel, SheetViewComponent} from "../../../business/sheets/DisplaySheet/DisplaySheet.viewmodel";
import {Button, TextField} from "@material-ui/core";
import { Navbar } from '../navbar/Navbar';

const displaySheetPresenter = new DisplaySheetPresenter()

export const DisplaySheet = () => {
    const [viewmodel, setViewmodel] = useState<DisplaySheetViewmodel>()
    displaySheetPresenter.setCallback(setViewmodel)

    useEffect(() => {
        displaySheetPresenter.Load()
    }, [])

    let mainContent = <h2>Loading...</h2>

    function viewComponentToHtml(viewComponent: SheetViewComponent) {
        switch (viewComponent.type) {
            case "text":
                return <span style={{verticalAlign: "center"}}> {viewComponent.text} </span>
            case "field":
                return <TextField id={viewComponent.id} label={viewComponent.hint} variant="outlined" size="small"
                                  color="primary" className='text-field'/>
        }
    }

    if (viewmodel) {
        const sheetContent = <div className="text">{viewmodel.components.map(c => viewComponentToHtml(c))}</div>;
        mainContent = <div className="container">
                <div className="m-2">
                    {sheetContent}
                    <hr/>
                    <div className="row">
                        <Button variant="contained" color="primary">
                            Check
                        </Button>
                    </div>
                </div>
            </div>
    }

    return (<div>
        <Navbar title={viewmodel?.title}/>
        <div className="mt-4">{mainContent}</div>
    </div>)
}






