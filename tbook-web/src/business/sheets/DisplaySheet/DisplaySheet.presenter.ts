import {Presenter} from "../../../abstraction/presenter";
import {SheetViewComponent, DisplaySheetViewmodel} from "./DisplaySheet.viewmodel";
import {ServerProvider} from "../../server-provider";
import {DisplaySheetRequest} from "./DisplaySheet.request";
import {DisplaySheetResponse} from "./DisplaySheet.response";
import {InlineOneWordFieldSheetComponent, SheetComponent} from "../sheet";

export class DisplaySheetPresenter extends Presenter<DisplaySheetViewmodel> {
    private data: DisplaySheetResponse = undefined;

    public async Load(): Promise<void> {
        let response = await ServerProvider.ServerGateway.SendRequest({path: 'display-sheet'} as DisplaySheetRequest).toPromise()
        this.data = response;
        this.Present();
    }

    private Present() {
        if (!this.data) this.setView(undefined);
        this.setView(this.GenerateViewModel(this.data))
    }

    private GenerateViewModel(data: DisplaySheetResponse): DisplaySheetViewmodel {
        return {
            title: data.name,
            components: data.components.map((sc) => this.DataComponentToViewmodelComponent(sc))
        }
    }

    private DataComponentToViewmodelComponent(c: SheetComponent): SheetViewComponent {
        switch (c.type) {
            case "text":
                return {type: 'text', text: c.text, id: c.id} as SheetViewComponent
            case "inline-one-word":
                let content = this.GetSheetViewmodelFieldContent(c);
                return {type: "field", content: content, id: c.id, state: 'not-processed', hint: c.hint ? c.hint : ''}
            default:
                return undefined;
        }
    }

    private GetSheetViewmodelFieldContent(c: InlineOneWordFieldSheetComponent) {
        if (c.content) return c.content;
        return "";
    }
}
