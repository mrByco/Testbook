import {Presenter} from "../../../abstraction/presenter";
import {EditSheetViewComponent, EditSheetViewmodel} from "./EditSheet.viewmodel";
import {ServerProvider} from "../../server-provider";
import {EditSheetResponse} from "./EditSheet.response";
import {EditSheetRequest} from "./EditSheet.request";
import {SheetComponent, TextSheetComponent} from "../sheet";
import {TBSelection} from "../../helper/selection";
import {v4 as uuidv4} from "uuid";

export class EditSheetPresenter extends Presenter<EditSheetViewmodel> {
    private data: EditSheetResponse = undefined;
    private selection: TBSelection = undefined;

    private get selectionIsCaret(): boolean {
        return this.selection.startChar == this.selection.endChar &&
            this.selection.startComponentId == this.selection.endComponentId;
    }

    public async Load() {
        this.data = await ServerProvider.ServerGateway.SendRequest({path: 'edit-sheet'} as EditSheetRequest).toPromise();
        this.cleanAndPresent();
    }

    public SetSelection(selection: TBSelection) {
        if (!this.haveComponentsWithIds([selection.startComponentId, selection.endComponentId])) {
            this.cleanAndPresent();
            return;
        }
        this.selection = {
            startChar: this.padSelectionCharPosition(selection.startChar, selection.startComponentId),
            endChar: this.padSelectionCharPosition(selection.endChar, selection.endComponentId),
            startComponentId: selection.startComponentId,
            endComponentId: selection.endComponentId
        };
        this.normalizeSelectionDirection();
        this.cleanAndPresent();
    }


    private normalizeSelectionDirection() {
        if (this.IsReversedSelection(this.selection)) {
            this.selection = EditSheetPresenter.getFlippedSelection(this.selection)
        }
    }

    public Type(insertText: string) {
        if (!this.selection) return;
        this.typeToSelection(insertText);
        this.cleanAndPresent();
    }

    public Delete(direction: 'forward' | 'backward') {
        if (this.selectionIsCaret) this.expandSelection(direction);
        this.deleteSelectionContent();
        this.cleanAndPresent();
    }

    private typeToSelection(text: string) {
        if (!this.selectionIsCaret) this.deleteSelectionContent()
        this.insertToCaret(text);
    }

    private insertToCaret(text: string) {
        const component = this.data.components.find((c) => c.id == this.selection.startComponentId)
        if (component.type == "text") this.typeToComponentAndShiftSelection(component, text);
    }

    private typeToComponentAndShiftSelection(component: TextSheetComponent, text: string) {
        component.text = EditSheetPresenter.splice(component.text, this.selection.startChar, this.selection.startChar, text);
        this.selection.startChar += text.length;
        this.selection.endChar += text.length;
    }

    private padSelectionCharPosition(charIndex: number, componentId: string) {
        let component = this.data.components.find(c => c.id == componentId);
        return component['text'] ? Math.min(Math.max(charIndex, 0), component['text'].length) : 0
    }

    private haveComponentsWithIds(ids: string[]): boolean {
        for (let id of ids) {
            if (!this.data.components.some((c) => c.id == id)) {
                console.error('Presenter does not have components with the selected id!', `id: "${id}"`);
                return false;
            }
        }
        return true;
    }

    private cleanAndPresent() {
        if (!this.data) this.setView(undefined);
        this.cleanUpComponents();
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
            .filter(c => c != undefined);
        this.resetSelectionLength();
    }

    private resetSelectionLength() {
        this.selection.endComponentId = this.selection.startComponentId;
        this.selection.endChar = this.selection.startChar;
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

    private getSelectedComponentIndexes(selection: TBSelection = this.selection) {
        const startIndex = this.data.components.indexOf(this.getComponentById(selection.startComponentId));
        const endIndex = this.data.components.indexOf(this.getComponentById(selection.endComponentId));
        return [startIndex, endIndex]
    }

    private static splice(original: string, from: number, to: number, text: string = '') {
        return original.slice(0, from) + text + original.slice(to);
    };

    private getComponentById(id: string) {
        return this.data.components.find(c => c.id == id);
    }

    private isComponentInSelection(component: any) {
        const [start, end] = this.getSelectedComponentIndexes();
        const componentIndex = this.data.components.indexOf(component);
        return start <= componentIndex && componentIndex <= end;
    }

    private cleanUpComponents() {
        let mergedComponents: SheetComponent[] = EditSheetPresenter.mergeComponentList(this.data.components);
        let onlyWithContent = mergedComponents.filter(c => c.type != 'text' || !c.text.match(/^ *$/) || this.isComponentInSelection(c))
        this.data.components = EditSheetPresenter.surroundWithTexts(onlyWithContent);
    }

    private static mergeComponentList(components: SheetComponent[]) {
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

    private expandSelection(direction: 'forward' | 'backward') {
        let edgeCharacter = direction == 'forward' ? this.selection.endChar : this.selection.startChar;
        let edgeComponentId = direction == 'forward' ? this.selection.endComponentId : this.selection.startComponentId;
        let edgeComponent = this.getComponentById(edgeComponentId);

        if (direction == 'backward' && edgeCharacter == 0 ||
            direction == "forward" && edgeCharacter == EditSheetPresenter.getComponentSelectableLength(edgeComponent)) {
            this.expandSelectionAcrossAComponent(edgeComponentId, direction);
        } else {
            if (direction == "forward") this.selection.endChar++;
            if (direction == "backward") this.selection.startChar--;
        }
    }

    private expandSelectionAcrossAComponent(edgeComponentId: string, direction: "forward" | "backward") {
        const edgeComponentIndex = this.data.components.findIndex(c => c.id == edgeComponentId);
        const componentIndexBeyondEdge = edgeComponentIndex + (direction == 'forward' ? 2 : -2);
        if (!this.getIsIndexInComponentRange(componentIndexBeyondEdge)) return;
        const componentBeyondEdge = this.data.components[componentIndexBeyondEdge];
        const newSelectedCharacterIndex = direction == 'forward' ? 0 : EditSheetPresenter.getComponentSelectableLength(componentBeyondEdge)
        if (direction == 'forward') {
            this.selection.endChar = newSelectedCharacterIndex;
            this.selection.endComponentId = componentBeyondEdge.id;
        }
        if (direction == 'backward') {
            this.selection.startChar = newSelectedCharacterIndex;
            this.selection.startComponentId = componentBeyondEdge.id;
        }
    }

    private getIsIndexInComponentRange(componentIndexBeyondEdge: number) {
        return componentIndexBeyondEdge >= 0 && componentIndexBeyondEdge < this.data.components.length;
    }

    private lastOrFirstCharacterOfComponent(character: number, component: SheetComponent) {
    }

    private static getComponentSelectableLength(component: SheetComponent) {
        if (component.type != "text") return 1;
        else return component.text.length;
    }

    private IsReversedSelection(selection: TBSelection) {
        const [first, second] = this.getSelectedComponentIndexes(selection)
        if (first == second) {
            return selection.startChar > selection.endChar;
        }
        return first > second;
    }

    private static getFlippedSelection(selection: TBSelection): TBSelection {
        return {
            endChar: selection.startChar,
            endComponentId: selection.startComponentId,
            startChar: selection.endChar,
            startComponentId: selection.endComponentId
        }
    }
}
