import * as Yup from "yup";

const registerValidation = Yup.object({
  nombres: Yup.string().required("Campo obligatorio"),
  apellidoPaterno: Yup.string(),
  apellidoMaterno: Yup.string(),
  numeroCarnet: Yup.string().required("Campo obligatorio"),
  complemento: Yup.string(),
  numeroCelular: Yup.string()
  .required("Campo obligatorio").matches(/^[67]\d{7}$/, "Número Inválido"),
  secciones: Yup.string().required("Campo obligatorio"),
  cargos: Yup.string().required("Campo obligatorio"),
  codVerificacion: Yup.string().required("Campo obligatorio"),
  imagen: Yup.mixed()
  .required("Campo obligatorio")
  .test("fileType", "Solo se permiten archivos de imagen", (value) => {
    return value && value.type.startsWith("image/");
  })


});

export default registerValidation;
