// TODO Replace with your own main view.

import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import IndexList from './index-list';

export const config: ViewConfig = {
    menu: {
        exclude: true
    },
};

export default function MainView() {
    return (
        <main className="p-m">
            <IndexList />
        </main>
    );
}