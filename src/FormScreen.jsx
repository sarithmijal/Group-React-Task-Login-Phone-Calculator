import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormik } from 'formik';
import { z } from 'zod';
import './FormScreen.css';

// 1. Esquema de validación central con Zod y mensajes claros en español
const formSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre completo es obligatorio.')
    .min(3, 'El nombre debe contener al menos 3 caracteres.')
    .max(50, 'El nombre no debe superar los 50 caracteres.'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio.')
    .email('Debe ingresar un correo electrónico válido (ej. usuario@dominio.com).'),
  rol: z
    .string()
    .min(1, 'Debe seleccionar un rol o modalidad (Estudiante, Docente o Invitado).'),
  carrera: z
    .string()
    .min(1, 'Debe seleccionar una carrera o materia de la lista.'),
  comentarios: z
    .string()
    .trim()
    .min(1, 'El campo de comentarios o descripción es obligatorio.')
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .max(300, 'Los comentarios no pueden exceder los 300 caracteres.'),
});

// Función de validación personalizada para Formik utilizando safeParse de Zod
const validateFormikWithZod = (values) => {
  const result = formSchema.safeParse(values);
  if (!result.success) {
    const errors = {};
    const issues = result.error.issues || result.error.errors || [];
    issues.forEach((issue) => {
      const field = issue.path[0];
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    });
    return errors;
  }
  return {};
};

// Opciones reutilizables
const OPCIONES_ROLES = ['Estudiante', 'Docente', 'Invitado'];
const OPCIONES_CARRERAS = [
  'Ingeniería de Sistemas',
  'Ingeniería de Software',
  'Ciencia de Datos e Inteligencia Artificial',
  'Diseño y Desarrollo Web',
  'Ciberseguridad y Redes',
];

export default function FormScreen({ onBack }) {
  // Selector de pestaña superior: 'rhf' | 'formik'
  const [activeTab, setActiveTab] = useState('rhf');

  // Estado para mostrar el resumen de datos enviados
  const [datosEnviados, setDatosEnviados] = useState(null);

  // --- IMPLEMENTACIÓN 1: REACT HOOK FORM + ZOD ---
  const {
    register: rhfRegister,
    handleSubmit: rhfHandleSubmit,
    reset: rhfReset,
    formState: { errors: rhfErrors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      email: '',
      rol: '',
      carrera: '',
      comentarios: '',
    },
    mode: 'onTouched',
  });

  const onRHFSubmit = (data) => {
    setDatosEnviados({
      origen: 'React Hook Form + Zod',
      ...data,
    });
  };

  const handleLimpiarRHF = () => {
    rhfReset();
    setDatosEnviados(null);
  };

  // --- IMPLEMENTACIÓN 2: FORMIK + ZOD ---
  const formik = useFormik({
    initialValues: {
      nombre: '',
      email: '',
      rol: '',
      carrera: '',
      comentarios: '',
    },
    validate: validateFormikWithZod,
    onSubmit: (values) => {
      setDatosEnviados({
        origen: 'Formik + Zod',
        ...values,
      });
    },
  });

  const handleLimpiarFormik = () => {
    formik.resetForm();
    setDatosEnviados(null);
  };

  return (
    <div className="tarjeta-formulario">
      <h2>Formulario de Registro</h2>
      <p className="subtitulo">Demostración técnica de validación con Zod</p>

      {/* Selector de pestañas superior */}
      <div className="tabs-selector">
        <button
          type="button"
          className={`tab-boton ${activeTab === 'rhf' ? 'activa' : ''}`}
          onClick={() => {
            setActiveTab('rhf');
            setDatosEnviados(null);
          }}
        >
          Versión React Hook Form + Zod
        </button>
        <button
          type="button"
          className={`tab-boton ${activeTab === 'formik' ? 'activa' : ''}`}
          onClick={() => {
            setActiveTab('formik');
            setDatosEnviados(null);
          }}
        >
          Versión Formik + Zod
        </button>
      </div>

      {/* Indicador de librería activa */}
      <span className="badge-libreria">
        Motor activo: {activeTab === 'rhf' ? 'useForm + zodResolver' : 'useFormik + schema.safeParse'}
      </span>

      {/* Resumen de datos capturados tras envío válido */}
      {datosEnviados && (
        <div className="resumen-contenedor">
          <div className="resumen-titulo">
            <span>✓</span> ¡Formulario enviado con éxito!
          </div>
          <span className="resumen-badge">Procesado con: {datosEnviados.origen}</span>
          <div className="resumen-item">
            <strong>Nombre completo:</strong> {datosEnviados.nombre}
          </div>
          <div className="resumen-item">
            <strong>Correo electrónico:</strong> {datosEnviados.email}
          </div>
          <div className="resumen-item">
            <strong>Rol / Modalidad:</strong> {datosEnviados.rol}
          </div>
          <div className="resumen-item">
            <strong>Carrera o Materia:</strong> {datosEnviados.carrera}
          </div>
          <div className="resumen-item">
            <strong>Comentarios:</strong> {datosEnviados.comentarios}
          </div>
          <button
            type="button"
            className="btn-limpiar"
            style={{ marginTop: '8px' }}
            onClick={activeTab === 'rhf' ? handleLimpiarRHF : handleLimpiarFormik}
          >
            Limpiar y nuevo registro
          </button>
        </div>
      )}

      {/* --- FORMULARIO REACT HOOK FORM --- */}
      {activeTab === 'rhf' && (
        <form onSubmit={rhfHandleSubmit(onRHFSubmit)} className="form-columna" noValidate>
          {/* 1. Nombre completo (Input text) */}
          <div className="campo-grupo">
            <label className="campo-label" htmlFor="rhf-nombre">
              Nombre Completo <span className="requerido">*</span>
            </label>
            <input
              id="rhf-nombre"
              type="text"
              placeholder="Ej. Ana Gómez"
              className={`campo-input ${rhfErrors.nombre ? 'error' : ''}`}
              {...rhfRegister('nombre')}
            />
            {rhfErrors.nombre && (
              <p className="mensaje-error">⚠️ {rhfErrors.nombre.message}</p>
            )}
          </div>

          {/* 2. Correo electrónico (Input email) */}
          <div className="campo-grupo">
            <label className="campo-label" htmlFor="rhf-email">
              Correo Electrónico <span className="requerido">*</span>
            </label>
            <input
              id="rhf-email"
              type="email"
              placeholder="Ej. ana.gomez@correo.com"
              className={`campo-input ${rhfErrors.email ? 'error' : ''}`}
              {...rhfRegister('email')}
            />
            {rhfErrors.email && (
              <p className="mensaje-error">⚠️ {rhfErrors.email.message}</p>
            )}
          </div>

          {/* 3. Rol / Modalidad (Radio buttons) */}
          <div className="campo-grupo">
            <label className="campo-label">
              Rol / Modalidad <span className="requerido">*</span>
            </label>
            <div className="radio-grupo">
              {OPCIONES_ROLES.map((rol) => (
                <label key={rol} className="radio-opcion">
                  <input
                    type="radio"
                    value={rol}
                    {...rhfRegister('rol')}
                  />
                  <span>{rol}</span>
                </label>
              ))}
            </div>
            {rhfErrors.rol && (
              <p className="mensaje-error">⚠️ {rhfErrors.rol.message}</p>
            )}
          </div>

          {/* 4. Carrera o Materia (Dropdown Select) */}
          <div className="campo-grupo">
            <label className="campo-label" htmlFor="rhf-carrera">
              Carrera o Materia <span className="requerido">*</span>
            </label>
            <select
              id="rhf-carrera"
              className={`campo-select ${rhfErrors.carrera ? 'error' : ''}`}
              {...rhfRegister('carrera')}
            >
              <option value="">-- Seleccione una opción --</option>
              {OPCIONES_CARRERAS.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
            {rhfErrors.carrera && (
              <p className="mensaje-error">⚠️ {rhfErrors.carrera.message}</p>
            )}
          </div>

          {/* 5. Comentarios o descripción (Textarea) */}
          <div className="campo-grupo">
            <label className="campo-label" htmlFor="rhf-comentarios">
              Comentarios o Descripción <span className="requerido">*</span>
            </label>
            <textarea
              id="rhf-comentarios"
              rows={3}
              placeholder="Escriba sus comentarios (mínimo 10 caracteres)..."
              className={`campo-textarea ${rhfErrors.comentarios ? 'error' : ''}`}
              {...rhfRegister('comentarios')}
            />
            {rhfErrors.comentarios && (
              <p className="mensaje-error">⚠️ {rhfErrors.comentarios.message}</p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="acciones-form">
            <button type="submit">Enviar (React Hook Form)</button>
            <button
              type="button"
              className="btn-limpiar"
              onClick={handleLimpiarRHF}
            >
              Limpiar Campos
            </button>
            <button
              type="button"
              className="btn-secundario"
              onClick={onBack}
            >
              Volver al Menú
            </button>
          </div>
        </form>
      )}

      {/* --- FORMULARIO FORMIK --- */}
      {activeTab === 'formik' && (
        <form onSubmit={formik.handleSubmit} className="form-columna" noValidate>
          {/* 1. Nombre completo (Input text) */}
          <div className="campo-grupo">
            <label className="campo-label" htmlFor="formik-nombre">
              Nombre Completo <span className="requerido">*</span>
            </label>
            <input
              id="formik-nombre"
              name="nombre"
              type="text"
              placeholder="Ej. Carlos Mendoza"
              className={`campo-input ${
                (formik.touched.nombre || formik.submitCount > 0) && formik.errors.nombre
                  ? 'error'
                  : ''
              }`}
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {(formik.touched.nombre || formik.submitCount > 0) && formik.errors.nombre && (
              <p className="mensaje-error">⚠️ {formik.errors.nombre}</p>
            )}
          </div>

          {/* 2. Correo electrónico (Input email) */}
          <div className="campo-grupo">
            <label className="campo-label" htmlFor="formik-email">
              Correo Electrónico <span className="requerido">*</span>
            </label>
            <input
              id="formik-email"
              name="email"
              type="email"
              placeholder="Ej. carlos.mendoza@correo.com"
              className={`campo-input ${
                (formik.touched.email || formik.submitCount > 0) && formik.errors.email
                  ? 'error'
                  : ''
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {(formik.touched.email || formik.submitCount > 0) && formik.errors.email && (
              <p className="mensaje-error">⚠️ {formik.errors.email}</p>
            )}
          </div>

          {/* 3. Rol / Modalidad (Radio buttons) */}
          <div className="campo-grupo">
            <label className="campo-label">
              Rol / Modalidad <span className="requerido">*</span>
            </label>
            <div className="radio-grupo">
              {OPCIONES_ROLES.map((rol) => (
                <label key={rol} className="radio-opcion">
                  <input
                    type="radio"
                    name="rol"
                    value={rol}
                    checked={formik.values.rol === rol}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span>{rol}</span>
                </label>
              ))}
            </div>
            {(formik.touched.rol || formik.submitCount > 0) && formik.errors.rol && (
              <p className="mensaje-error">⚠️ {formik.errors.rol}</p>
            )}
          </div>

          {/* 4. Carrera o Materia (Dropdown Select) */}
          <div className="campo-grupo">
            <label className="campo-label" htmlFor="formik-carrera">
              Carrera o Materia <span className="requerido">*</span>
            </label>
            <select
              id="formik-carrera"
              name="carrera"
              className={`campo-select ${
                (formik.touched.carrera || formik.submitCount > 0) && formik.errors.carrera
                  ? 'error'
                  : ''
              }`}
              value={formik.values.carrera}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">-- Seleccione una opción --</option>
              {OPCIONES_CARRERAS.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
            {(formik.touched.carrera || formik.submitCount > 0) && formik.errors.carrera && (
              <p className="mensaje-error">⚠️ {formik.errors.carrera}</p>
            )}
          </div>

          {/* 5. Comentarios o descripción (Textarea) */}
          <div className="campo-grupo">
            <label className="campo-label" htmlFor="formik-comentarios">
              Comentarios o Descripción <span className="requerido">*</span>
            </label>
            <textarea
              id="formik-comentarios"
              name="comentarios"
              rows={3}
              placeholder="Escriba sus comentarios (mínimo 10 caracteres)..."
              className={`campo-textarea ${
                (formik.touched.comentarios || formik.submitCount > 0) &&
                formik.errors.comentarios
                  ? 'error'
                  : ''
              }`}
              value={formik.values.comentarios}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {(formik.touched.comentarios || formik.submitCount > 0) &&
              formik.errors.comentarios && (
                <p className="mensaje-error">⚠️ {formik.errors.comentarios}</p>
              )}
          </div>

          {/* Botones de acción */}
          <div className="acciones-form">
            <button type="submit">Enviar (Formik)</button>
            <button
              type="button"
              className="btn-limpiar"
              onClick={handleLimpiarFormik}
            >
              Limpiar Campos
            </button>
            <button
              type="button"
              className="btn-secundario"
              onClick={onBack}
            >
              Volver al Menú
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
