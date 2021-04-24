import {DisplaySheetInteractor} from "./DisplaySheet.interactor";
import {Provider} from "../../provider";

describe('DisplaySheet', () => {
    let interactor;

    beforeEach(() => {
        interactor = new DisplaySheetInteractor(Provider.Entities.SheetEntity)
    })

    it('Return object should have components', function () {
        let response = interactor.execute()
        expect(response).toHaveProperty('components')
    });

    it('Return object should have name', function () {
        let response = interactor.execute()
        expect(response).toHaveProperty('name')
    });
})
