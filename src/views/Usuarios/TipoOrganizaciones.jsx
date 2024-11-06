import React, { useEffect, useRef } from "react";
import { Table, Form } from "antd";
import "antd/dist/antd.css";
//Local
import EditableCell from "../../components/Custom/EditableCell";
import useTable from "../../hooks/useTable";
import { columns } from "../../utils/columnCommon";
import FormItem from "../../components/Custom/FormCommon";
//Styles
import useStyles from "../../assets/jss/material-dashboard-pro-react/views/common";
//Constants
const title = "Tipo de organizaciones";
const name = "Tipo de organización";
const key = "tipoOrganizacion";

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
    editItem,
    delItem,
    save,
    isEditing,
    cancel,
    onFinishFailed,
    updateNameItem,
  } = useTable({ key });

  useEffect(() => {
    updateNameItem(name);
  }, []);

  return (
    <>
      <FormItem
        name={name}
        title={title}
        maxName={30}
        maxCode={5}
        formCreate={formCreate}
        createItem={createItem}
        onFinishFailed={onFinishFailed}
        loading={loading}
      />
      <br />
      <Form form={formEdit} component={false}>
        <Table
          className={classes.table}
          components={{
            body: {
              cell: EditableCell,
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
            classes
          )}
          loading={loading}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            pageSize: 5,
          }}
        />
      </Form>
    </>
  );
}
