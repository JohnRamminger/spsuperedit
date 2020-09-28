import * as React from 'react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { ISPSuperFieldUserProps } from '.';
// import { escape } from '@microsoft/sp-lodash-subset';
// import { TextField } from 'office-ui-fabric-react/lib/TextField';

export class SPSuperFieldUser extends React.Component<ISPSuperFieldUserProps, {}> {
    public render(): React.ReactElement<ISPSuperFieldUserProps> {
        const bDisabled: boolean = this.props.mode === 'Display';
        let userLimit: number = 1;
        if (this.props.field.type === 'UserMulti') {
            userLimit = 100;
        }
        return (
            <PeoplePicker
                disabled={bDisabled}
                context={this.props.ctx}
                titleText={this.props.field.title}
                personSelectionLimit={userLimit}
                showtooltip={true}
                isRequired={this.props.field.required}
                selectedItems={this._getPeoplePickerItems}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                resolveDelay={1000} />
        );
    }
    // tslint:disable-next-line
    private _getPeoplePickerItems(items: any[]) {
        console.log('Items:', items);
    }

}
