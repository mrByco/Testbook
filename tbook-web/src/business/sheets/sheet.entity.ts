import {Sheet} from "./sheet";
import {Entity} from "../../abstraction/entity";

export class SheetEntity extends Entity {
    public GetSheet(): Sheet{
        return {components: [], name: ""}
    }
}
