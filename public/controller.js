export class Controller
{
    constructor(model, view)
    {
        model.regSelectPat((idx, pat) => view.selectPat(idx, pat));
        model.regSetLength(l => view.setLength(l));





    }
}
