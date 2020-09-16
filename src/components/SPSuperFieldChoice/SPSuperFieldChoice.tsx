import * as React from 'react';
import { ISPSuperFieldChoiceProps, ISPSuperFieldChoiceReactState } from './';
// import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from '@pnp/sp';
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export class SPSuperFieldChoice extends React.Component<ISPSuperFieldChoiceProps, ISPSuperFieldChoiceReactState> {
    constructor(props: ISPSuperFieldChoiceProps) {
        super(props);
        // Default Color
        this.state = { choices: [], selectedItem: '' };
    }

    public componentDidMount() {
        const tmpChoices: IDropdownOption[] = [];
        let oWeb = new Web(this.props.ctx.pageContext.web.absoluteUrl);
        oWeb.lists.getById(this.props.listID).fields.
            getByInternalNameOrTitle(this.props.field.name).
            get().then(result => {
                result.Choices.forEach(choice => {
                    tmpChoices.push({ key: choice, text: choice });
                });
                this.setState({ choices: tmpChoices, selectedItem: this.props.value });
            });
    }

    public render(): React.ReactElement<ISPSuperFieldChoiceProps> {
        const field: JSX.Element[] = [];
        const selected: string[] = [];
        selected.push(this.state.selectedItem);
        const cboOptions: IDropdownOption[] = this.state.choices;

        field.push(<Dropdown onChanged={this.onComboChange}
            options={cboOptions}

            defaultSelectedKeys={selected}

            label={this.props.field.title}
            required={this.props.field.required} />);
        return (<div>{field}</div>);
    }




    private onComboChange = (e) => {
        debugger;
        let value: string = e.text;
        this.setState({ selectedItem: value })
    }
}
