import {RequestModel} from '../../../abstraction/request-model'


interface GetSheet {
    requestType: 'get'
}

type EditSheetRequestData = GetSheet;

export interface EditSheetRequest extends RequestModel {
    path: 'edit-sheet',
    data: GetSheet
}
