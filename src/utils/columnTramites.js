import React from "react";
import {
  Popconfirm,
  Input,
  Space,
  Tag,
  Tooltip,
  Button as ButtonAnt,
} from "antd";
import Button from "components/CustomButtons/Button.js";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import GetAppIcon from "@material-ui/icons/GetApp";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import { SearchOutlined } from "@ant-design/icons";

const handleSearch = (confirm) => {
  confirm();
};

const handleReset = (clearFilters) => {
  clearFilters();
};

const getColumnSearchProps = (dataIndex, nameItem, searchInput) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={searchInput}
        placeholder={
          dataIndex === "name" ? `Buscar ${nameItem}` : "Buscar código"
        }
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch(confirm)}
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(confirm)}
          icon={<SearchOutlined />}
          size="sm"
          style={{ width: 90, backgroundColor: "#40a9ff" }}
        >
          Buscar
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="sm"
          style={{ width: 90 }}
        >
          Limpiar
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : "",
});

function columns(
  cancel,
  isEditing,
  updateOnEdit,
  save,
  delItem,
  editItem,
  onEdit,
  onDelete,
  nameItem,
  searchInput,
  classes,
  getDocument,
) {
  const columns = [
    {
      title: "Identificación del Trámite",
      dataIndex: "identificacionTramite",
      editable: false,
      width: "15%",
      sorter: (a, b) => (a.identificacionTramite ? a.identificacionTramite.localeCompare(b.identificacionTramite) : 0),
      ...getColumnSearchProps("identificacionTramite", nameItem, searchInput),
    },
    {
      title: "Tipo de Trámite",
      dataIndex: "tipoTramite",
      editable: false,
      width: "15%",
      sorter: (a, b) => (a.tipoTramite ? a.tipoTramite.localeCompare(b.tipoTramite) : 0),
      ...getColumnSearchProps("tipoTramite", nameItem, searchInput),
    },
    {
      title: "Nombre del Trámite",
      dataIndex: "nombreTramite",
      editable: false,
      width: "15%",
      sorter: (a, b) => (a.nombreTramite ? a.nombreTramite.localeCompare(b.nombreTramite) : 0),
      ...getColumnSearchProps("nombreTramite", nameItem, searchInput),
    },
    {
      title: "Anotaciones",
      dataIndex: "anotaciones",
      editable: true,
      width: "20%",
      sorter: (a, b) => (a.anotaciones ? a.anotaciones.localeCompare(b.anotaciones) : 0),
      ...getColumnSearchProps("anotaciones", nameItem, searchInput),
    },
    {
      title: "Adjuntos",
      dataIndex: "link",
      editable: false,
      width: "15%",
      render: (_, record) => {
        return (
          <>
          {record.documentos?.map((doc, index)=>(
           <Tooltip key={index} title={doc.documento}>
              <Button color="info" className={classes.actionButton} onClick={()=> getDocument({documento: doc, nombreTramite: record.nombreTramite})}>
                <GetAppIcon className={classes.icon} />
              </Button>
            </Tooltip>)
          )}

          </>
        );
      },
    },
    {
      title: "Fecha de Creación",
      dataIndex: "createdAt",
      editable: false,
      width: "15%",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
   /* {
      title: "Acciones",
      dataIndex: "actions",
      width: "10%",
      render: (_, record) => {
        const editable = isEditing(record);
        if (editable) {
          updateOnEdit(true);
        }
        return editable ? (
          <div>
            <ButtonAnt type="link" onClick={() => save(record.id)}>
              Guardar
            </ButtonAnt>
            <Popconfirm title="Seguro deseas cancelar?" onConfirm={cancel}>
              <ButtonAnt type="link">Cancelar</ButtonAnt>
            </Popconfirm>
          </div>
        ) : (
          <div>
            <Tooltip title="Editar">
              <Button
                color="success"
                disabled={onEdit}
                className={classes.actionButton}
                onClick={() => editItem(record)}
              >
                <Edit className={classes.icon} />
              </Button>
            </Tooltip>
            <Popconfirm
              title="Seguro deseas eliminar?"
              onConfirm={() => delItem(record.id)}
            >
              <Button
                color="danger"
                disabled={onEdit || onDelete}
                className={classes.actionButton}
              >
                <Close className={classes.icon} />
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },*/
  ];
  
  const inpType = (col) => {
    switch (col.dataIndex) {
      case "createdAt":
        return "date";
      default:
        return "text";
    }
  };
  return columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: inpType(col),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
}

export { columns };
