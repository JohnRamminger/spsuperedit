import * as React from 'react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { ISPSuperFieldUserProps } from '.';
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

export class SPSuperFieldUser extends React.Component<ISPSuperFieldUserProps, {}> {
    public render(): React.ReactElement<ISPSuperFieldUserProps> {
        let userLimit: number = 1;
        if (this.props.field.type === "UserMulti") {
            userLimit = 100;
        }
        return (
            <PeoplePicker
                context={this.props.ctx}
                titleText={this.props.field.title}
                personSelectionLimit={userLimit}
                showtooltip={true}
                isRequired={this.props.field.required}
                // selectedItems={this._getPeoplePickerItems}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                resolveDelay={1000} />
        );
    }
}
