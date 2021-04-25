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


    })

})
