import {Presenter} from "../../../abstraction/presenter";
import {EditSheetViewComponent, EditSheetViewmodel} from "./EditSheet.viewmodel";
import {ServerProvider} from "../../server-provider";
import {EditSheetResponse} from "./EditSheet.response";
import {EditSheetRequest} from "./EditSheet.request";
import {SheetComponent} from "../sheet";
import {TBSelection} from "../../helper/selection";
import {indigo} from "@material-ui/core/colors";

export class EditSheetPresenter extends Presenter<EditSheetViewmodel> {
    private data: EditSheetResponse = undefined;
    private selection: TBSelection = undefined;

    public async Load() {
        this.data = await ServerProvider.ServerGateway.SendRequest({path: 'edit-sheet'} as EditSheetRequest).toPromise();
        this.present();
    }

    public SetSelection(selection: TBSelection) {
        if (!this.haveSelectionIds([selection.startComponentId, selection.endComponentId])) {
            this.present();
            return;
        }
        this.selection = {
            startChar: this.padSelectionCharPosition(selection.startChar, selection.startComponentId),
            endChar: this.padSelectionCharPosition(selection.endChar, selection.endComponentId),
            startComponentId: selection.startComponentId,
            endComponentId: selection.endComponentId
        };
        this.present();
    }


    public Type(insertText: string) {
        if (!this.selection) return;
        this.addTextToCurrentSelction(insertText)
        this.present();
    }

    private addTextToCurrentSelction(text: string){
        const component = this.data.components.find((c) => c.id == this.selection.startComponentId)
        if (component.type == "text"){
            console.log(this.selection.startChar)
            component.text = this.splice(component.text, this.selection.startChar, this.selection.endChar, text);
        }
    }

    private padSelectionCharPosition(charIndex: number, componentId: string) {
        let component = this.data.components.find(c => c.id == componentId);
        return component['text'] ? Math.min(Math.max(charIndex, 0), component['text'].length - 1) : 0
    }

    private haveSelectionIds(ids: string[]): boolean {
        for (let id of ids) {
            if (!this.data.components.some((c) => c.id == id)) {
                console.error('Presenter does not have components with the selected id!', id);
                return false;
            }
        }
        return true;
    }

    private present() {
        if (!this.data) this.setView(undefined);
        this.setView(this.generateViewModel(this.data))
    }

    private generateViewModel(data: EditSheetResponse): EditSheetViewmodel {
        return {
            selection: this.selection,
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

    private splice(original: string, from: number, to: number, text: string) {
        return original.slice(0, from) + text + original.slice(to);
    };

}
