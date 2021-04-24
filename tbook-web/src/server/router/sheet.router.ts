import {RequestProcessor} from "../request-processor";
import {DisplaySheetInteractor} from "../../business/sheets/DisplaySheet/DisplaySheet.interactor";

export function RegisterSheets(requestProcessor: RequestProcessor){
    requestProcessor.RegisterRequest('display-sheet', DisplaySheetInteractor.get)
}
