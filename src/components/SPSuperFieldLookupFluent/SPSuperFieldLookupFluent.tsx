import * as React from 'react';
import { ISPSuperFieldLookupFluentProps, ISPSuperFieldLookupFluentReactState } from '.';
// import { escape } from '@microsoft/sp-lodash-subset';
import styles from '../SPSuperEdit/Spsuperedit.module.scss';
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import { ISPFieldChoiceValue } from '../../models';
import { MiscFunctions } from '../../services';
export class SPSuperFieldLookupFluent extends React.Component<ISPSuperFieldLookupFluentProps, ISPSuperFieldLookupFluentReactState> {
    constructor(props: ISPSuperFieldLookupFluentProps) {
        super(props);
        // Default Color
        this.state = { choices: [], selectedItem: this.props.value };
    }


    public componentDidUpdate() {
        let dropDownValue = document.getElementById('lu' + this.props.field.name + '-option');
        let strValue = this.state.selectedItem;
        if (MiscFunctions.IsEmpty(strValue)) {
            strValue = this.props.value;
        }
        strValue = strValue.substring(strValue.indexOf('|') + 1);
        dropDownValue.innerText = strValue;
    }

    public componentDidMount(): void {

    }

    public render(): React.ReactElement<ISPSuperFieldLookupFluentProps> {
        const field: JSX.Element[] = [];
        const selected: string[] = [];
        const bDisabled: boolean = this.props.mode === 'Display';
        const choices: string[] = [];
        let strValue: string = this.state.selectedItem;
        let selectedKey: string;
        if (MiscFunctions.IsEmpty(strValue)) {
            strValue = this.props.value;
        }
        if (strValue.indexOf('|') > -1) {
            selectedKey = strValue.substring(0, strValue.indexOf('|'));
            strValue = strValue.substring(strValue.indexOf('|') + 1);

        }
        if (this.props) {
            for (let i = 0; i < this.props.choices.length; i++) {
                const choice = this.props.choices[i];
                choices.push(choice.text);
            }
        }
        selected.push(this.state.selectedItem);
        field.push(<div className={styles.DropDownLabelStyle}>{this.props.field.title}</div>);
        field.push(
            <Dropdown id={'lu' + this.props.field.name} options={this.props.choices}
                disabled={bDisabled}
                defaultSelectedKey={selectedKey}
                onChanged={this.onLookupChange}
            />);
        return (<div className={styles.fieldstyle} >{field}</div>);
    }


    private GetLookupID(value: string): string {
        for (let index: number = 0; index < this.props.choices.length; index++) {
            const choice: ISPFieldChoiceValue = this.props.choices[index];
            if (choice.text === value) {
                return choice.key;
            }
        }
        return '';
    }
    // tslint:disable-next-line
    private onLookupChange = (e) => {

        const idValue: string = this.GetLookupID(e.text);
        this.props.changed(this.props.field, idValue + '|' + e.text);
        this.setState({ selectedItem: idValue + '|' + e.text });
    }
}
