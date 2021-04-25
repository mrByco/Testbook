import {Presenter} from "../../../abstraction/presenter";
import {EditSheetViewComponent, EditSheetViewmodel} from "./EditSheet.viewmodel";
import {ServerProvider} from "../../server-provider";
import {EditSheetResponse} from "./EditSheet.response";
import {EditSheetRequest} from "./EditSheet.request";
import {SheetComponent} from "../sheet";

export class EditSheetPresenter extends Presenter<EditSheetViewmodel> {
    private data: EditSheetResponse = undefined;

    public async Load() {
        this.data = await ServerProvider.ServerGateway.SendRequest({path: 'edit-sheet'} as EditSheetRequest).toPromise();
        this.present();
    }

    private present() {
        if (!this.data) this.setView(undefined);
        this.setView(this.generateViewModel(this.data))
    }

    private generateViewModel(data: EditSheetResponse): EditSheetViewmodel {
        return {
            title: data.name,
            components: data.components.map(c => this.convertComponentToViewComponent(c))
        }
    }

    private convertComponentToViewComponent(component: SheetComponent): EditSheetViewComponent {
        switch (component.type) {
            case "text":
                return {type: "text", text: component.text, id: component.id}
            case "inline-one-word":
                const color = '#992211'
                const displayText = `${component.correctAnswers.length > 0 ? component.correctAnswers[0] : '[NO ANSWER SET]'} ${`(${component.hint})`}`
                return {
                    type: "object",
                    objectType: 'field',
                    displayName: 'Check field',
                    displayText: displayText,
                    answers: component.correctAnswers,
                    helperText: component.hint,
                    id: component.id,
                    renderColor: color
                }
        }
    }
}
