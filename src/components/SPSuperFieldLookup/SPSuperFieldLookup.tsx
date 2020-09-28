import * as React from 'react';
import { ISPSuperFieldLookupProps, ISPSuperFieldLookupReactState } from '.';
// import { escape } from '@microsoft/sp-lodash-subset';
import styles from '../SPSuperEdit/Spsuperedit.module.scss';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { ISPFieldChoiceValue } from '../../models';
export class SPSuperFieldLookup extends React.Component<ISPSuperFieldLookupProps, ISPSuperFieldLookupReactState> {
    constructor(props: ISPSuperFieldLookupProps) {
        super(props);
        // Default Color
        this.state = { choices: [], selectedItem: '' };
    }

    public componentDidMount(): void {
        // const tmpChoices: string[] = [];
        // const oWeb: Web = new Web(this.props.ctx.pageContext.web.absoluteUrl);
        // oWeb.lists.getById(this.props.listID).fields.
        //     getByInternalNameOrTitle(this.props.field.name).
        //     get().then(result => {
        //         result.Choices.forEach(choice => {
        //             tmpChoices.push(choice);
        //         });
        //         this.setState({ choices: tmpChoices, selectedItem: this.props.value });
        //     });
    }

    public render(): React.ReactElement<ISPSuperFieldLookupProps> {
        const field: JSX.Element[] = [];
        const selected: string[] = [];
        const bDisabled: boolean = this.props.mode === 'Display';
        const choices: string[] = [];
        let strValue: string = this.state.selectedItem;
        if (strValue.indexOf('|') > -1) {
            strValue = strValue.substring(strValue.indexOf('|') + 1);
        }
        if (this.props) {
            this.props.choices.forEach(choice => {
                choices.push(choice.value);
            });
        }
        selected.push(this.state.selectedItem);
        field.push(<div className={styles.DropDownLabelStyle}>{this.props.field.title}</div>);
        field.push(
            <Dropdown options={choices}
                disabled={bDisabled}
                value={strValue}
                onChange={this.onLookupChange}
                placeholder='Select an option' />);
        return (<div className={styles.fieldstyle} >{field}</div>);
    }

    private GetLookupID(value: string): string {
        for (let index: number = 0; index < this.props.choices.length; index++) {
            const choice: ISPFieldChoiceValue = this.props.choices[index];
            if (choice.value === value) {
                return choice.key;
            }
        }
        return '';
    }
    // tslint:disable-next-line
    private onLookupChange = (e) => {
        const idValue: string = this.GetLookupID(e.value);
        this.props.changed(this.props.field, idValue + '|' + e.value);
        this.setState({ selectedItem: idValue + '|' + e.value });
    }
}
