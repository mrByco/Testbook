import {Sheet} from "./sheet";
import {Entity} from "../../abstraction/entity";
import {getRealisticExampleSheet} from "../../test/ExampleSheets";

export class SheetEntity extends Entity {
    public GetSheet(): Sheet{
        return getRealisticExampleSheet()
    }
}
