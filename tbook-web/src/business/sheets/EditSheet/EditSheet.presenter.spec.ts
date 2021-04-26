import {ServerProvider} from "../../server-provider";
import {MockServerGateway} from "../../../test/mock-server-gateway";
import {getExampleSheetResponse} from "../../../test/ExampleSheets";
import {EditSheetViewComponent, EditSheetViewmodel} from "./EditSheet.viewmodel";
import {EditSheetPresenter} from "./EditSheet.presenter";
import {EditSheetResponse} from "./EditSheet.response";

describe('EditSheet presenter', () => {

    describe("With realistic example response", () => {
        let presenter: EditSheetPresenter;
        let result: EditSheetViewmodel
        beforeAll(async () => {
            ServerProvider.ServerGateway = new MockServerGateway(() => getExampleSheetResponse())
            presenter = new EditSheetPresenter();
            presenter.setCallback((vm) => {
                result = vm;
            });
            await presenter.Load();
        })

        it('should return value', function () {
            expect(result).toBeTruthy()
        });

        it('should be the same amount of components after presentation', function () {
            expect(result.components.length).toBe(getExampleSheetResponse().components.length)
        });
    })

    describe("Convert", () => {
        async function getPresentResult(response: EditSheetResponse) {
            let presenter: EditSheetPresenter;
            ServerProvider.ServerGateway = new MockServerGateway(() => response)
            presenter = new EditSheetPresenter();
            presenter.Load();
            return new Promise<EditSheetViewmodel>(r => {
                presenter.setCallback((vm) => {
                    r(vm);
                });
            });
        }

        it('should pass text', async function () {
            let result = await getPresentResult({
                components: [
                    {type: "text", id: '1', text: 'Text of the sheet'},
                ], name: "Title"
            })
            let expected: EditSheetViewmodel = {
                selection: undefined,
                title: 'Title',
                components: [
                    {type: "text", id: '1', text: 'Text of the sheet'}
                ]
            }
            expect(result).toEqual(expected)
        });

        it('should online-one-word should be red', async function () {
            const result = await getPresentResult({
                components: [
                    {type: "inline-one-word", id: '1', hint: 'hint', correctAnswers: []}
                ], name: "Title"
            });
            const checkComponent: EditSheetViewComponent = result.components[0];
            expect(checkComponent['renderColor']).toEqual('#992211')
        });

        it('should show error message when there is no correct answer', async function () {
            const result = await getPresentResult({
                components: [
                    {type: "inline-one-word", id: '1', hint: 'hint', correctAnswers: []}
                ], name: "Title"
            });
            const checkComponent: EditSheetViewComponent = result.components[0];
            expect(checkComponent['displayText']).toEqual('[NO ANSWER SET] (hint)')
        });

        it('should show error message when there is no correct answer', async function () {
            const result = await getPresentResult({
                components: [
                    {type: "text", text: 'text', id: '1'},
                    {type: "inline-one-word", id: '2', hint: 'hint', correctAnswers: ['answer1', 'answer2']}
                ], name: "Title"
            });
            const checkComponent: EditSheetViewComponent = result.components[1];
            expect(checkComponent['displayText']).toEqual('answer1 (hint)')
        });


        it('should pass all the correct answers', async function () {
            const result = await getPresentResult({
                components: [
                    {type: "text", text: 'text', id: '1'},
                    {type: "inline-one-word", id: '2', hint: 'hint', correctAnswers: ['answer1', 'answer2']}
                ], name: "Title"
            });
            const checkComponent: EditSheetViewComponent = result.components[1];
            expect(checkComponent['answers'].length).toBe(2)
        });
    });

    describe('Text editor', () => {
        let presenter: EditSheetPresenter;
        let lastViewmodel: EditSheetViewmodel;

        beforeEach(async () => {
            ServerProvider.ServerGateway = new MockServerGateway(() => someEditSheetResponse)
            presenter = new EditSheetPresenter();
            presenter.Load();
            await new Promise<void>(r => {
                presenter.setCallback((vm) => {
                    lastViewmodel = vm;
                    r();
                });
            });
            return;
        });

        it('should set selection', function () {
            presenter.SetSelection({startChar: 1, endChar: 2, startComponentId: '1', endComponentId: '1'})
            expect(lastViewmodel.selection).toEqual({
                startChar: 1,
                endChar: 2,
                startComponentId: '1',
                endComponentId: '1'
            })
        });

        it('should limit selection in valid area', function () {
            presenter.SetSelection({startChar: 900, endChar: 1000, startComponentId: '1', endComponentId: '1'});
            expect(lastViewmodel.selection.startChar).toBe(someEditSheetResponse.components[0]['text'].length - 1)
            expect(lastViewmodel.selection.endChar).toBe(someEditSheetResponse.components[0]['text'].length - 1)
        });

        it('should type single letters', function () {
            presenter.SetSelection({startChar: 2, endChar: 2, startComponentId: '1', endComponentId: '1'});
            presenter.Type("g");
            expect(lastViewmodel.components[0]['text']).toBe('sogmeText')
        });

        it('should type to multy character selections', function () {
            presenter.SetSelection({startChar: 2, endChar: 4, startComponentId: '1', endComponentId: '1'});
            presenter.Type("g");
            expect(lastViewmodel.components[0]['text']).toBe('sogText')
        });

        it('should type to cross component selection');
        it('should type to edge components');
    });
});

const someEditSheetResponse: EditSheetResponse = {
    components: [
        {type: "text", id: '1', text: 'someText'},
        {
            type: 'inline-one-word',
            id: '2',
            hint: 'someTextHint',
            content: undefined,
            correctAnswers: ['answer1', 'answer2']
        }
    ],
    name: "someName"
}
