import {
  List,
  Datagrid,
  TextField,
  NumberField,
  TextInput,
  NumberInput,
  SimpleForm,
  Edit
} from 'react-admin';

export const ChapterList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <NumberField source="number" />
      <TextField source="id" />
    </Datagrid>
  </List>
);

export const ChapterEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <NumberInput source="number" />
      <TextInput source="id" />
    </SimpleForm>
  </Edit>
);
