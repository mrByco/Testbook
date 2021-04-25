import * as React from 'react'
import {FC, useEffect, useState} from 'react'
import './DisplaySheet.scss'
import {DisplaySheetPresenter} from "../../../business/sheets/DisplaySheet/DisplaySheet.presenter";
import {DisplaySheetViewmodel, DisplaySheetViewComponent} from "../../../business/sheets/DisplaySheet/DisplaySheet.viewmodel";
import {Button, TextField} from "@material-ui/core";
import {NavbarOptions} from '../navbar/Navbar';

const displaySheetPresenter = new DisplaySheetPresenter()

export const DisplaySheet: FC<DisplaySheetProps> = (props) => {
    const [viewmodel, setViewmodel] = useState<DisplaySheetViewmodel>()
    displaySheetPresenter.setCallback(setViewmodel)
    useEffect(() => {
        props.onSetNavbarOptions({title: viewmodel?.title, addressOnClose: "/"})
    }, [viewmodel])

    useEffect(() => {
        displaySheetPresenter.Load()
    }, [])


    if (!viewmodel) return (<div className="container mt-4"><h2>Loading...</h2></div>)

    function viewComponentToHtml(viewComponent: DisplaySheetViewComponent) {
        switch (viewComponent.type) {
            case "text":
                return <span style={{verticalAlign: "center"}}> {viewComponent.text} </span>
            case "field":
                return <TextField id={viewComponent.id} label={viewComponent.hint} variant="outlined" size="small"
                                  color="primary" className='text-field'/>
        }
    }

    const sheetContent = <div className="text">{viewmodel.components.map(c => viewComponentToHtml(c))}</div>;
    return (<div className="container mt-4">
        <div className="m-2">
            {sheetContent}
            <hr/>
            <div className="d-flex flex-row justify-content-around">
                <Button variant="contained" color="primary">
                    Go back
                </Button>
                <Button variant="contained" color="primary">
                    Check answers
                </Button>
                <Button variant="contained" color="primary">
                    Next
                </Button>
            </div>
        </div>
    </div>)
}

export interface DisplaySheetProps {
    onSetNavbarOptions: (options: NavbarOptions) => void
}






