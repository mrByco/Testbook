import {Interactor} from "../../../abstraction/interactor";
import {Sheet} from "../sheet";
import {SheetEntity} from "../sheet.entity";
import {Provider} from "../../provider";

export class DisplaySheetInteractor implements Interactor<Sheet> {
    constructor(private SheetEntity: SheetEntity) {
    }

    execute(): Sheet {
        return this.SheetEntity.GetSheet();
    }

    static get(): Interactor<Sheet> {
        return new DisplaySheetInteractor(Provider.Entities.SheetEntity)
    }

}
