import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  SimpleForm,
  Edit,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  required
} from 'react-admin';

export const TextList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <ReferenceField source="chapter" reference="chapters">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="id" />
      <TextField source="translation" />
    </Datagrid>
  </List>
);

export const TextEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="text" />
      <TextInput source="name" />
      <NumberInput source="index" />
      <TextInput source="sanskrit" />
      <TextInput source="wbw" />
      <TextInput source="translation" />
      <ReferenceInput
        label="Chapter"
        source="chapter"
        reference="chapters"
        validate={[required()]}
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
