import React, { useRef } from "react";
import { Table, Form } from "antd";
import "antd/dist/antd.css";
//Local
import EditableCell from "../../components/Custom/EditableCellTramite";
import useTable from "../../hooks/useTableTramite";
import { columns } from "../../utils/columnTramites";
import FormFiltrosTramites from "components/Custom/FormFiltrosTramites";
//Styles
import useStyles from "../../assets/jss/material-dashboard-pro-react/views/common";
//Constants
const title = "Consultar Tramites";
const name = "Tramites";
const key = "edicto";

export default function EditableTable() {
  const classes = useStyles();
  const searchInput = useRef();
  const {
    formEdit,
    formCreate,
    data,
    loading,
    onEdit,
    onDelete,
    updateOnEdit,
    createItem,
    searchItem,
    getDocument,
    editItem,
    delItem,
    save,
    isEditing,
    cancel,
    onFinishFailed,
  } = useTable({ key });

  return (
    <>
      <FormFiltrosTramites
        name={name}
        title={title}
        formCreate={formCreate}
        createItem={createItem}
        searchItem={searchItem}
        onFinishFailed={onFinishFailed}
        loading={loading}
         />
      <br />
      <Form form={formEdit} component={false}>
        <Table
          className={classes.table}
          components={{
            body: {
              cell: (props) => <EditableCell form={formEdit} {...props} />,
            },
          }}
          size="small"
          bordered
          scroll={{ x: 500 }}
          dataSource={data}
          columns={columns(
            cancel,
            isEditing,
            updateOnEdit,
            save,
            delItem,
            editItem,
            onEdit,
            onDelete,
            name,
            searchInput,
            classes,
            getDocument,
          )}
          loading={loading}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            pageSize: 10,
          }}
        />
      </Form>
    </>
  );
}
