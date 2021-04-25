import {Interactor} from "../../../abstraction/interactor";
import {SheetEntity} from "../sheet.entity";
import {Provider} from "../../provider";
import {DisplaySheetResponse} from "./DisplaySheet.response";

export class DisplaySheetInteractor implements Interactor<DisplaySheetResponse> {
    constructor(private SheetEntity: SheetEntity) {
    }

    execute() {
        return this.SheetEntity.GetSheet();
    }

    static get(): Interactor<DisplaySheetResponse> {
        return new DisplaySheetInteractor(Provider.Entities.SheetEntity)
    }

}
