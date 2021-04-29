import * as React from 'react'
import * as ReactDom from 'react-dom'
import {FC, SyntheticEvent, useEffect, useState} from 'react'
import './EditSheet.scss'
import {Button, IconButton, TextField} from "@material-ui/core";
import {NavbarOptions} from '../navbar/Navbar';
import CloseIcon from "@material-ui/icons/Close";
import {EditSheetPresenter} from "../../../business/sheets/EditSheet/EditSheet.presenter";
import {EditSheetViewComponent, EditSheetViewmodel} from "../../../business/sheets/EditSheet/EditSheet.viewmodel";
import {Simulate} from "react-dom/test-utils";
import focus = Simulate.focus;


const editSheetPresenter = new EditSheetPresenter();

export const EditSheet: FC<DisplaySheetProps> = (props) => {
    const [viewmodel, setViewmodel] = useState<EditSheetViewmodel>()
    editSheetPresenter.setCallback(setViewmodel)

    useEffect(() => {
        const header: JSX.Element[] = [
            <div className="d-flex flex-row align-items-center w-100">
                <h4 style={{color: "white"}}>Editing: </h4>
                <input key="sheet-name-input" className="ml-2 super-clean-input white"
                       style={{width: '80%', minWidth: 150}}/>
            </div>,
            <IconButton key="close-btn" style={{color: "white"}}><CloseIcon key={"close-icon"}
                                                                            fontSize="large"/></IconButton>]
        props.onSetNavbarOptions({addressOnClose: "/", contentOverride: header})

        if (viewmodel?.selection) {
            const startNode = ReactDom.findDOMNode(document.getElementById(viewmodel.selection.startComponentId));
            const endNode = ReactDom.findDOMNode(document.getElementById(viewmodel.selection.endComponentId));
            const selectAnchor = startNode.firstChild && viewmodel.selection.startChar > 0 ? startNode.firstChild : startNode;
            const selectCenter = endNode.firstChild && viewmodel.selection.endChar > 0 ? endNode.firstChild : endNode;
            window.getSelection().setBaseAndExtent(selectAnchor, viewmodel.selection.startChar, selectCenter, viewmodel.selection.endChar)
            console.log(window.getSelection())
        }
    }, [viewmodel])

    useEffect(() => {
        editSheetPresenter.Load()
    }, [])


    if (!viewmodel) return (<div className="container mt-4"><h2>Loading...</h2></div>)

    function viewComponentToHtml(viewComponent: EditSheetViewComponent) {
        switch (viewComponent.type) {
            case "text":
                console.log(viewComponent.text.length)
                return <span id={viewComponent.id}
                             key={viewComponent.id}>{viewComponent.text}</span>;
            case "object":
                return <span id={viewComponent.id} key={viewComponent.id} contentEditable={false}
                             className="content object"
                             style={{
                                 cursor: 'pointer',
                                 whiteSpace: 'nowrap',
                                 color: `${viewComponent.renderColor}${false ? 'FF' : 'BF'}`
                             }}>{viewComponent.displayText}</span>
        }
    }

    function onSelect(e: SyntheticEvent<HTMLDivElement>) {
        const selection = window.getSelection()
        let focusNode: any;
        let anchorNode: any;
        if (selection.focusNode['attributes']){
            console.log(selection.focusNode['attributes'])
            focusNode = (selection.focusNode['attributes'] as NamedNodeMap).getNamedItem('id').value;
        }else {
            focusNode = selection.focusNode['id'] ? selection.focusNode['id'] : selection.focusNode.parentElement.id
        }
        if (selection.anchorNode['attributes']){
            console.log(selection.anchorNode['attributes'])
            anchorNode = (selection.anchorNode['attributes'] as NamedNodeMap).getNamedItem('id').value;
        }else {
            anchorNode = selection.anchorNode['id'] ? selection.anchorNode['id'] : selection.anchorNode.parentElement.id
        }
        console.log(anchorNode, focusNode)
        editSheetPresenter.SetSelection({
            startChar: selection.anchorOffset,
            endChar: selection.focusOffset,
            startComponentId: anchorNode,
            endComponentId: focusNode
        })
    }

    function onType(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key.length == 1) {
            if (e.key == "x" && e.ctrlKey) {
                console.log("Cut caught")
            } else if (e.key == "c" && e.ctrlKey) {
                console.log("Copy caught")
            } else if (e.key == "v" && e.ctrlKey) {
                console.log("Paste caught")
            } else {
                editSheetPresenter.Type(e.key);
            }
            e.preventDefault()
        } else if (e.key == 'Enter') {
            console.log("Enter caught")
            e.preventDefault()
        } else if (e.key == 'Backspace') {
            e.preventDefault()
            editSheetPresenter.Delete('backward')
        } else if (e.key == 'Delete') {
            e.preventDefault()
            editSheetPresenter.Delete('forward')
        }
    }

    const sheetContent = <div className="text"
                              onSelect={(e) => onSelect(e)}
                              onKeyDown={(e) => onType(e)}
                              suppressContentEditableWarning={true}
                              contentEditable={true}>{viewmodel.components.map(c => viewComponentToHtml(c))}</div>;
    return (<div className="container mt-4">
        <div className="m-2">
            <div className={"d-flex flex-row justify-content-between"}>
                <Button disabled={true} color={"primary"} variant={"contained"}>Convert to field</Button>
                <Button disabled={true} color={"primary"} variant={"contained"}>Help</Button>
            </div>
            <hr/>
            {sheetContent}
            <hr/>
            <div className="d-flex flex-row justify-content-around">
                <Button variant="contained" color="primary">
                    Discard changes
                </Button>
                <Button variant="contained" color="primary">
                    Save it
                </Button>
            </div>
        </div>
    </div>)
}

interface DisplaySheetProps {
    onSetNavbarOptions: (options: NavbarOptions) => void
}








