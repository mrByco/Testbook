import {RequestProcessor} from "../request-processor";
import {DisplaySheetInteractor} from "../../business/sheets/DisplaySheet/DisplaySheet.interactor";
import {EditSheetInteractor} from "../../business/sheets/EditSheet/EditSheet.interactor";

export function RegisterSheets(requestProcessor: RequestProcessor){
    requestProcessor.RegisterRequest('display-sheet', DisplaySheetInteractor.get)
    requestProcessor.RegisterRequest('edit-sheet', EditSheetInteractor.get)
}
