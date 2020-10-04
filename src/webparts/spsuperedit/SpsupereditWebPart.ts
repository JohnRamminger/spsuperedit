import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneButton,
  PropertyPaneButtonType
} from '@microsoft/sp-webpart-base';
import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy
} from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { ISPSuperEditProps, SPSuperEdit, FieldConfigDialog } from '../../components';
import { SvcSuperFields } from '../../services/svcSuperField';
import { ISPSuperField } from '../../models';
import { SPLogging, MiscFunctions } from '../../services';
export interface ISpsupereditWebPartProps {
  listID: string;
  fields: ISPSuperField[];
  skipFields: string;
}

export default class SPSuperEditWebPart extends BaseClientSideWebPart<ISpsupereditWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISPSuperEditProps> = React.createElement(
      SPSuperEdit,
      {
        listID: this.properties.listID,
        fields: this.properties.fields,
        ctx: this.context
      }

    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'This web part allows for the advanced editing of a SharePoint list'
          },
          groups: [
            {
              groupName: 'General Settings',
              groupFields: [
                PropertyFieldListPicker('listid', {
                  label: 'Select a list',
                  selectedList: this.properties.listID,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onListChanged.bind(this),
                  multiSelect: false,
                  properties: this.properties,
                  context: this.context,
                  // tslint:disable-next-line
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyPaneTextField('skipFields', { label: 'Skip Fields' }),
                PropertyPaneButton('configureFields', {
                  text: 'Configure Fields',
                  buttonType: PropertyPaneButtonType.Hero,
                  icon: 'Edit',
                  onClick: this.configureButtons.bind(this)
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private configureButtons(): void {
    const dialog: FieldConfigDialog = new FieldConfigDialog();
    dialog.wpContext = this.context;
    dialog.fieldConfig = this.properties.fields;
    dialog.show().then(() => {
      try {
        this.properties.fields = dialog.fieldConfig;
      } catch (e) {
        SPLogging.LogError('configureButtons', e.message);
      }
    });
  }

  // tslint:disable-next-line
  private async onListChanged(propertyPath: string, oldValue: any, newValue: any) {
    const currentFields: ISPSuperField[] = [];
    await SvcSuperFields.GetFields(this.context.pageContext.web.absoluteUrl, newValue).then(fields => {
      this.properties.listID = newValue;
      let iLoadOrder: number = 0;
      fields.forEach(fld => {
        const bSkipField: boolean = MiscFunctions.GetSkipField(fld.name, this.properties.skipFields);
        console.log(fld.name);
        if (!SvcSuperFields.HasField(fld.title, currentFields)) {
          if (bSkipField) {
            fld.visible = false;
          } else {
            fld.visible = true;
          }
          fld.loadOrder = iLoadOrder;
          currentFields.push(fld);
        }
        iLoadOrder++;
      });
    });

    this.properties.fields = currentFields;
    this.render();
  }
}
