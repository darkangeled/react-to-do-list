import { useReducer, useEffect } from "react";
import "./sass/styles.scss";
import Navbar from "./components/Navbar/Navbar";
import Lista from "./components/Listas/Lista";
import Form from "./components/Form/Form";
import { Tarea, Footer } from "./components/Listas/Elementos";

const ACCIONES_LISTA = {
  CAMBIAR_INPUT: "EL USUARIO ESTA ESCRIBIENDO UNA TAREA",
  AGREGAR_TAREA: "AGREGAR NUEVA TAREA",
  ELIMINAR_TAREA: "ELIMINAR UNA TAREA",
  COMPLETAR_TAREA: "COMPLETAR UNA TAREA",
  NUEVA_LISTA: "INICIALIZANDO TAREAS",
};

const ERRORES = {
  CARACTERES: "Ingrese más de 3 caracteres",
  DUPLICADO: "Ya existe esa tarea",
};

const statusInicialesTareas = { COMPLETADO: 1, PENDIENTE: 0 };

const valorIniciales = {
  accion: ACCIONES_LISTA.NUEVA_LISTA,
  inputTarea: "",
  tareasCompletadas: 0,
  tareasTotal: 0,
  tareas: [],
  // bloquear: "",
  error: false,
  errorTxt: "",
  // tachar: "",
};

const existeError = (valor) => {
  let error;
  let txt;
  if (valor.trim().length < 4 && valor.trim().length > 0) {
    error = true;
    txt = ERRORES.CARACTERES;
  } else {
    error = false;
    txt = "";
  }
  return { error, txt };
};

// const existeTarea = (valor) => {
//   let error;
//   let txt;
//   let existe = JSON.parse(localStorage.getItem("Lista_Tareas")).find((tarea) => tarea === valor);
//   if(existe){
//     error = true;
//     txt = ERRORES.DUPLICADO;
//   } else {
//     error = false;
//     txt = "";
//   }
//   return { error, txt };
// };
const existeSession = () => {
  if (!localStorage.getItem("Lista_Tareas")) {
    localStorage.setItem("Lista_Tareas", JSON.stringify(valorIniciales.tareas));
    return false;
  } else {
    return true;
  }
};

const tareasReducer = (estadoAnterior, action) => {
  console.log("Reducer - " + action.accion);
  switch (action.accion) {
    case ACCIONES_LISTA.NUEVA_LISTA: {
      if (existeSession() === true) {
        let viejaLista = JSON.parse(localStorage.getItem("Lista_Tareas"));
        let Objetos = Object.keys(viejaLista).map((tarea, iteracion) => {
          return viejaLista[tarea]
        });
        let ObjetosTotales = Objetos.length;
        let ObjetosCompletados = Object.keys(viejaLista).filter(
          (tarea) => viejaLista[tarea].estatus === statusInicialesTareas.COMPLETADO
        );
        return {
          ...estadoAnterior,
          tareas: Objetos,
          tareasCompletadas: ObjetosCompletados.length,
          tareasTotal: ObjetosTotales
        };
      } else {
        return {
          ...estadoAnterior,
        };
      }
    }
    case ACCIONES_LISTA.CAMBIAR_INPUT: {
      let { error, txt } = existeError(action.datos.valor);
      if (error) {
        return {
          ...estadoAnterior,
          error: error,
          errorTxt: txt,
          inputTarea: action.datos.valor.trim(),
        };
      } else {
        return {
          ...estadoAnterior,
          error: error,
          errorTxt: txt,
          inputTarea: action.datos.valor.trim(),
        };
      }
    }
    case ACCIONES_LISTA.AGREGAR_TAREA: {
      let { error, txt } = existeError(action.datos.valor);
      if (
        error === true &&
        (action.datos.trigger === action.datos.evento ||
          action.datos.trigger === "Botón")
      ) {
        return {
          ...estadoAnterior,
          error: true,
          errorTxt: txt,
          inputTarea: action.datos.valor.trim(),
        };
      } else {
        let tareasAnterior = estadoAnterior.tareas || valorIniciales.tareas;
        let nuevaTarea = [...tareasAnterior];
        nuevaTarea.push({
          nombre: action.datos.valor.trim(),
          estatus: action.datos.status,
        });
        localStorage.setItem(
          "Lista_Tareas",
          JSON.stringify({
            ...nuevaTarea,
          })
        );
        return {
          ...estadoAnterior,
          error: error,
          errorTxt: txt,
          inputTarea: "",
          tareas: nuevaTarea,
          tareasTotal: estadoAnterior.tareasTotal + 1,
        };
      }
    }
    case ACCIONES_LISTA.ELIMINAR_TAREA: {
      const misTareasRestantes = estadoAnterior.tareas.filter(
        (tarea, iteracion) => iteracion !== action.datos.id
      );
      localStorage.setItem(
        "Lista_Tareas",
        JSON.stringify(misTareasRestantes)
      );
      return {
        ...estadoAnterior,
        tareas: misTareasRestantes,
        tareasTotal: estadoAnterior.tareasTotal - 1,
      };
    }
    case ACCIONES_LISTA.COMPLETAR_TAREA: {
      let tareasAnterior = estadoAnterior.tareas || valorIniciales.tareas;
      let nuevaTarea = [...tareasAnterior];
      nuevaTarea[action.datos.id].estatus = action.datos.status;
      localStorage.setItem("Lista_Tareas", JSON.stringify(nuevaTarea));
      const tareasAnterioresCompletadas = estadoAnterior.tareasAnterioresCompletadas || 0;
      if (action.datos.valor === true) {
        return {
          ...estadoAnterior,
          tareasCompletadas: tareasAnterioresCompletadas + 1,
          // tachar: "completada",
          // bloquear: "disabled",
          // elemSeleccionado: action.datos.id,
        };
      } else {
        return {
          ...estadoAnterior,
          tareasCompletadas:
            tareasAnterioresCompletadas > 0
              ? tareasAnterioresCompletadas - 1
              : 0,
        };
      }
    }
    default: {
      return estadoAnterior;
    }
  }
};

function App() {
  useEffect(() => {
    dispatcherTareasEvent({ accion: valorIniciales.accion });
  }, []);

  const [stateTarea, dispatcherTareasEvent] = useReducer(
    tareasReducer,
    valorIniciales
  );

  const onAddButtonHandler = () => {
    dispatcherTareasEvent({
      accion: ACCIONES_LISTA.AGREGAR_TAREA,
      datos: {
        trigger: "Botón",
        total: 0,
        valor: stateTarea.inputTarea,
        status: statusInicialesTareas.PENDIENTE,
      },
    });
  };

  const onChangeInputHandler = (event) => {
    dispatcherTareasEvent({
      accion: ACCIONES_LISTA.CAMBIAR_INPUT,
      datos: { valor: event.target.value },
    });
  };

  const onKeyDownHandler = (event) => {
    event.key === "Enter" &&
      dispatcherTareasEvent({
        accion: ACCIONES_LISTA.AGREGAR_TAREA,
        datos: {
          valor: event.target.value,
          evento: "Enter",
          trigger: event.key,
          status: statusInicialesTareas.PENDIENTE,
        },
      });
  };

  const onDeleteHandler = (id) => {
    dispatcherTareasEvent({
      accion: ACCIONES_LISTA.ELIMINAR_TAREA,
      datos: { id: id },
    });
  };

  const onChangeCheckboxHandler = (valor, id) => {
    let estado;
    valor === true ? estado = statusInicialesTareas.COMPLETADO : estado = statusInicialesTareas.PENDIENTE
    dispatcherTareasEvent({
      accion: ACCIONES_LISTA.COMPLETAR_TAREA,
      datos: {
        valor: valor,
        id: id,
        status: estado
      },
    });
  };

  return (
    <>
      <div className="main">
        <Navbar></Navbar>
        <div className="columns is-mobile">
          <div className="column is-three-fifths is-offset-one-fifth">
            <div className="block">
              <Lista>
                <div className="panel-block">
                  <div className="control has-icons">
                    <Form
                      value={stateTarea.inputTarea}
                      onClick={onAddButtonHandler}
                      onKeyDown={onKeyDownHandler}
                      onChange={onChangeInputHandler}
                      error={stateTarea.error}
                      errorTxt={stateTarea.errorTxt}
                    ></Form>
                  </div>
                </div>
                {stateTarea.tareas &&
                  stateTarea.tareas.map((tarea, iteracion) => (
                    <Tarea
                      id={iteracion}
                      key={iteracion}
                      onDelete={onDeleteHandler}
                      onChange={onChangeCheckboxHandler}
                      estado={tarea.estatus}
                    >
                      {tarea.nombre}
                    </Tarea>
                  ))}
                <div className="container">
                  <Footer
                    total={stateTarea.tareasTotal}
                    completadas={stateTarea.tareasCompletadas}
                    abiertas={
                      stateTarea.tareasTotal - stateTarea.tareasCompletadas
                    }
                  ></Footer>
                </div>
              </Lista>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
