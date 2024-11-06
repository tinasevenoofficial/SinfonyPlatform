import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Form, message } from "antd";
import { EXTERNAL_API_PATHS } from "../utils/constants";

const useTable = () => {
  const [formEdit] = Form.useForm();
  const [formCreate] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [onEdit, setOnEdit] = React.useState(false);
  const [onDelete, setOnDelete] = React.useState(false);

  const transformData = (tramite) => ({
    id: tramite.id,
    key: tramite.id,
    documentos: tramite.documentos,
    anotaciones: tramite.anotaciones,
    tipoTramite: tramite.tipo_tramite,
    identificacionTramite: tramite.identificacion_tramite,
    nombreTramite: tramite.nombre_tramite,
    idPlantilla: tramite.id_plantilla,
    claseTramite: tramite.clase_tramite,
    reqDocTramite: tramite.req_doc_tramite,
    reqDataTramite: tramite.req_data_tramite,
    data: tramite.data,
    createdAt: moment(tramite.created_at).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
  });
  
  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  useEffect(() => {
    searchItem('OrdenEscrituracion',formatDate(moment()),formatDate(moment().add(1,"days")));
  }, []);

  const headers = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const typeAlert = "updatable";
  
  const searchItem = (tipoTramite = '',startDate,endDate) =>{
    setLoading(true);
    axios.get(EXTERNAL_API_PATHS.tramites+`?tipo_tramite=${tipoTramite}&start_date=${startDate}&end_date=${endDate}`).then((res) => {
      const newData =
        res.data.length > 0
          ? res.data.map((tramite) => transformData(tramite))
          : [];
      setData(newData);
      setLoading(false);
    });

  }

  const createItem = (values, setValues) => {
    message.loading({ content: "Subiendo archivo...", typeAlert });
    const formData = new FormData();
    formData.append("archivo", values.file);
    formData.append(
      "fecha_expiracion",
      moment(values.expiration).format("YYYY-MM-DD")
    );
    formData.append(
      "fecha_inicio",
      moment(values.startDate).format("YYYY-MM-DD")
    );
    formData.append("nombre_cliente", values.name);
    formData.append("titulo", values.title);
    axios
      .post(EXTERNAL_API_PATHS.edicto, formData, headers)
      .then((res) => {
        setData((d) => [...d, transformData(res.data)]);
        message.success({ content: "Edicto creado correctamente", typeAlert });
        setValues({
          title: "",
          name: "",
          expiration: moment().add(1, "days"),
          startDate: moment(),
          file: null,
          fileName: "",
        });
      })
      .catch(() => {
        message.error({ content: "Error al crear edicto", typeAlert });
      });
  };

  const editItem = (record) => {
    formEdit.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const delItem = (id) => {
    const newData = [...data];
    const index = newData.findIndex((item) => id === item.id);
    if (index > -1) {
      message.loading({ content: "Eliminando edicto...", typeAlert });
      updateOnDelete(true);
      axios
        .delete(`${EXTERNAL_API_PATHS.edicto}/${id}`)
        .then(() => {
          newData.splice(index, 1);
          setData(newData);
          message.success({
            content: "Edicto eliminado correctamente",
            typeAlert,
          });
          updateOnDelete(false);
        })
        .catch(() => {
          message.error({
            content: "Error interno, intente nuevamente",
            typeAlert,
          });
        });
    } else {
      message.error({ content: "Error al eliminar edicto", typeAlert });
    }
  };

  const save = async (id) => {
    try {
      const row = await formEdit.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const formData = new FormData();
        if (typeof row.link === "object") {
          formData.append("archivo", row.link);
        }
        formData.append(
          "fecha_expiracion",
          moment(row.expiration).format("YYYY-MM-DD")
        );
        formData.append(
          "fecha_inicio",
          moment(row.startDate).format("YYYY-MM-DD")
        );
        formData.append("nombre_cliente", row.name);

        formData.append("titulo", row.title);
        message.info("Guardando...", 3);
        axios
          .post(
            `${EXTERNAL_API_PATHS.edicto}/${id}?_method=PUT`,
            formData,
            headers
          )
          .then((res) => {
            newData.splice(index, 1, transformData(res.data));
            setData(newData);
            setEditingKey("");
            message.success(`Editado con exito`);
            setOnEdit(false);
          })
          .catch(() => {
            message.error(`No se pudo editar`);
          });
      }
    } catch (errInfo) {
      message.error("Ocurrió un error en el guardado");
    }
  };
  const getDocument = async (record) => {
    try{
    let categoria = record.documento.path.includes("FormatoRegistro")? "FormatoRegistro": ""
    let tipoTramite = record.nombreTramite + categoria 
    let fileName = record.documento.Nombre_Documento
    let extension = record.documento.extension

    const response = await  axios.get(EXTERNAL_API_PATHS.files+`/${tipoTramite}${'Tramites'}/${fileName}.${extension}`,{ responseType: 'blob'})

    if (response.status == 200) {
         // Crear un Blob a partir de la respuesta binaria
        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        // Crear una URL para el Blob
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace temporal para la descarga
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName; // Nombre con el que se descargará el archivo

        // Añadir el enlace al DOM y simular un clic
        document.body.appendChild(a);
        a.click();

        // Limpiar el DOM y revocar la URL
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } else {
      console.error('Error en la descarga del archivo:', response.statusText);
    }

    
  } catch (error) {
    console.error('Error en la descarga del archivo:', error);
  }
   }

  const isEditing = (record) => record.id === editingKey;

  const cancel = () => {
    setEditingKey("");
    setOnEdit(false);
  };

  const onFinishFailed = () => {
    message.error(`Complete el formulario`);
  };

  const updateOnEdit = (value) => {
    setOnEdit(value);
  };

  const updateOnDelete = (value) => {
    setOnDelete(value);
  };

  const updateLoading = (value) => {
    setLoading(value);
  };

  const updateData = (value) => {
    setData(value);
  };

  return {
    formEdit,
    formCreate,
    data,
    loading,
    onEdit,
    onDelete,
    updateData,
    updateOnEdit,
    updateLoading,
    createItem,
    searchItem,
    getDocument,
    editItem,
    delItem,
    save,
    isEditing,
    cancel,
    onFinishFailed,
  };
};

export default useTable;
