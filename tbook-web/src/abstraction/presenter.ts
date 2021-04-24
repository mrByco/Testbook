export class Presenter<VM> {
    public setView: (viewmodel: VM) => void = () => {};
    setCallback(callback: (viewmodel: VM) => void) {
        this.setView = callback;
    }
}
