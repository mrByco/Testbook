import {Interactor} from "../../../abstraction/interactor";
import {EditSheetResponse} from "./EditSheet.response";
import {Provider} from "../../provider";
import {SheetEntity} from "../sheet.entity";

export class EditSheetInteractor implements Interactor<EditSheetResponse> {
    constructor(private SheetEntity: SheetEntity) {
    }

    execute() {
        return this.SheetEntity.GetSheet();
    }

    static get(): Interactor<EditSheetResponse> {
        return new EditSheetInteractor(Provider.Entities.SheetEntity)
    }

}
