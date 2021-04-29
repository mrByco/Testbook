import {Presenter} from "../../../abstraction/presenter";
import {EditSheetViewComponent, EditSheetViewmodel} from "./EditSheet.viewmodel";
import {ServerProvider} from "../../server-provider";
import {EditSheetResponse} from "./EditSheet.response";
import {EditSheetRequest} from "./EditSheet.request";
import {SheetComponent} from "../sheet";
import {TBSelection} from "../../helper/selection";
import {v4 as uuidv4} from "uuid";

export class EditSheetPresenter extends Presenter<EditSheetViewmodel> {
    private data: EditSheetResponse = undefined;
    private selection: TBSelection = undefined;

    private get selectionIsCarret(): boolean {
        return this.selection.startChar == this.selection.endChar &&
            this.selection.startComponentId == this.selection.endComponentId;
    }

    public async Load() {
        this.data = await ServerProvider.ServerGateway.SendRequest({path: 'edit-sheet'} as EditSheetRequest).toPromise();
        this.cleanUpComponents()
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
        this.typeToSelection(insertText);
        this.cleanUpComponents();
        this.present();
    }

    private typeToSelection(text: string) {
        if (!this.selectionIsCarret) this.deleteSelectionContent()
        this.insertToCarret(text);
    }

    private insertToCarret(text: string) {
        const component = this.data.components.find((c) => c.id == this.selection.startComponentId)
        if (component.type == "text") {
            component.text = EditSheetPresenter.splice(component.text, this.selection.startChar, this.selection.startChar, text);
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

    private deleteSelectionContent() {
        this.data.components = this.data.components
            .map(c => this.deleteSelectedPartOfComponent(c.id))
            .filter(c => c != undefined)
    }

    private deleteSelectedPartOfComponent(componentId: string): SheetComponent | undefined {
        const component = this.getComponentById(componentId);
        if (!this.isComponentInSelection(component)) return component
        if (this.isWholeComponentSelected(componentId)) return undefined;
        return this.getRemainingAfterInComponentSelectionRemoved(componentId, component)
    }

    private getRemainingAfterInComponentSelectionRemoved(componentId: string, component: SheetComponent) {
        const deleteStart = this.selection.startComponentId == componentId ? this.selection.startChar : 'start'
        const deleteEnd = this.selection.endComponentId == componentId ? this.selection.endChar : 'end'
        return EditSheetPresenter.deletePartOfComponent(component, deleteStart, deleteEnd);
    }

    private static deletePartOfComponent(component: SheetComponent, deleteFrom: number | 'start', deleteTo: number | 'end'): SheetComponent {
        if (component.type == 'text') {
            let from = deleteFrom == "start" ? 0 : deleteFrom;
            let to = deleteTo == "end" ? component.text.length : deleteTo;
            return {type: 'text', id: component.id, text: this.splice(component.text, from, to)}
        } else {
            return undefined;
        }
    }

    private isWholeComponentSelected(componentId: string): boolean {
        const [startIndex, endIndex] = this.getSelectedComponentIndexes()
        const componentIndex = this.data.components.indexOf(this.getComponentById(componentId));
        return startIndex < componentIndex && componentIndex < endIndex;
    }

    private getSelectedComponentIndexes() {
        const startIndex = this.data.components.indexOf(this.getComponentById(this.selection.startComponentId));
        const endIndex = this.data.components.indexOf(this.getComponentById(this.selection.endComponentId));
        return [startIndex, endIndex]
    }

    private static splice(original: string, from: number, to: number, text: string = '') {
        return original.slice(0, from) + text + original.slice(to);
    };

    private getComponentById(id: string) {
        return this.data.components.find(c => c.id == id);
    }

    private isComponentInSelection(component) {
        const [start, end] = this.getSelectedComponentIndexes();
        const componentIndex = this.data.components.indexOf(component);
        return start <= componentIndex && componentIndex <= end;
    }

    private cleanUpComponents() {
        let mergedComponents = EditSheetPresenter.mergeComponentList(this.data.components);
        this.data.components = EditSheetPresenter.surroundWithTexts(mergedComponents);
    }

    private static mergeComponentList(components: SheetComponent[]) {
        let i = 0;
        const mergedComponents = [];
        let currentWorkingComponent = undefined;
        for (let component of components) {
            if (!currentWorkingComponent) {
                currentWorkingComponent = component
                continue;
            }
            let tryMerge = EditSheetPresenter.tryMergeComponents(currentWorkingComponent, component);
            if (tryMerge != undefined) {
                currentWorkingComponent = tryMerge;
                continue;
            }
            mergedComponents.push(currentWorkingComponent);
            currentWorkingComponent = component;
        }
        return [...mergedComponents, currentWorkingComponent]
    }

    private static tryMergeComponents(componentA: SheetComponent, componentB: SheetComponent): SheetComponent | undefined {
        if (componentA.type == "text" && componentB.type == "text") {
            return {type: 'text', text: componentA.text + componentB.text, id: componentA.id};
        }
        //Returns undefined if can not merge components
        return undefined;

    }

    private static surroundWithTexts(mergedComponents: SheetComponent[]) {
        const surroundedComponents = [];
        const addEmptyText = () => {
            surroundedComponents.push({type: 'text', text: '', id: uuidv4().toString()} as SheetComponent)
        }
        let lastWasText = false;
        for (const component of mergedComponents) {
            if (component.type != "text" && !lastWasText) addEmptyText();
            surroundedComponents.push(component);
            lastWasText = component.type == "text";
        }
        if (!lastWasText) addEmptyText();
        return surroundedComponents;
    }
}
