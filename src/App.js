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
};

const ERRORES = {
  CARACTERES: "Ingrese más de 3 caracteres",
  DUPLICADO: "Ya existe esa tarea",
}

const valorIniciales = { accion: "NUEVA LISTA", tareasCompletadas: 0, tareasTotal: 0, misTareas: [] };

const existeError = (valor) => {
  let error;
  let txt;
  if(valor.trim().length < 4 && valor.trim().length > 0){
    error = true;
    txt = ERRORES.CARACTERES;
    return { error, txt };
  } else {
    valorIniciales.misTareas.find((tarea) =>
      tarea === valor
        ? ((error = true), (txt = ERRORES.DUPLICADO))
        : ((error = false), (txt = ""))
    );
    return { error, txt };
  }
};

const tareasReducer = (estadoAnterior, action) => {
  console.log("Reducer - " + action.accion);
  switch (action.accion) {
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
        let { error, txt } = existeError(action.datos.valor);
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
      if (error === true && ((action.datos.trigger === action.datos.evento) || action.datos.trigger === "Botón")) {
        return {
          ...estadoAnterior,
          error: error,
          errorTxt: txt,
          inputTarea: action.datos.valor.trim(),
        };
      } else {
        let tareasAnterior = estadoAnterior.tarea || valorIniciales.misTareas;
        localStorage.setItem(
          "Lista_Tareas",
          JSON.stringify([...tareasAnterior, action.datos.valor.trim()])
        );
        return {
          ...estadoAnterior,
          error: error,
          errorTxt: txt,
          inputTarea: '',
          tarea: [...tareasAnterior, action.datos.valor.trim()],
          tareasTotal: estadoAnterior.tareasTotal + 1,
        };
      }
    }
    case ACCIONES_LISTA.ELIMINAR_TAREA: {
      const misTareasRestantes = estadoAnterior.tarea.filter((tarea, iteracion) => iteracion !== action.datos.id);
      localStorage.setItem("Lista_Tareas", JSON.stringify(misTareasRestantes));

      return {
        ...estadoAnterior,
        tarea : misTareasRestantes,
        tareasTotal: estadoAnterior.tareasTotal - 1,
      };
    }
    case ACCIONES_LISTA.COMPLETAR_TAREA: {
      const tareasAnterioresCompletadas = estadoAnterior.tareas || 0;
      if (action.datos.valor === true) {
        return {
          ...estadoAnterior,
          tareasCompletadas: tareasAnterioresCompletadas + 1,
          tachar: "completada",
          bloquear: "disabled",
        };
      } else {
        return {
          ...estadoAnterior,
          tareasCompletadas: tareasAnterioresCompletadas > 0 ? tareasAnterioresCompletadas - 1 : 0,
          tachar: "",
          bloquear: "",
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
    !localStorage.getItem("Lista_Tareas") ? localStorage.setItem("Lista_Tareas",valorIniciales.misTareas) : JSON.stringify(localStorage.getItem("Lista_Tareas"));
  }, []);

  const [stateTarea, dispatcherTareasEvent] = useReducer(
    tareasReducer,
    valorIniciales
  );


  /*useEffect(() => {
    console.log("Mi input debe cambiar a: ", stateTarea.inputTarea);
    setValorInput(stateTarea.inputTarea);
    setMisTareas(stateTarea.tarea);
  },[stateTarea.inputTarea,stateTarea.tarea]);*/

  const onAddButtonHandler = () => {
    dispatcherTareasEvent({ accion: ACCIONES_LISTA.AGREGAR_TAREA, datos: {evento: "Botón", total: 0, valor: stateTarea.inputTarea }});
  };

  const onChangeInputHandler = (event) => {
    dispatcherTareasEvent({ accion: ACCIONES_LISTA.CAMBIAR_INPUT, datos: { valor: event.target.value }});
  };

  const onKeyDownHandler = (event) => {
    event.key === 'Enter' && dispatcherTareasEvent({ accion: ACCIONES_LISTA.AGREGAR_TAREA, datos : { valor: event.target.value, evento: "Enter", trigger: event.key }})
  };

  const onDeleteHandler = (id) => {
    dispatcherTareasEvent({ accion: ACCIONES_LISTA.ELIMINAR_TAREA, datos: { id: id } });
  };

  const onChangeCheckboxHandler = (event) => {
    dispatcherTareasEvent({ accion: ACCIONES_LISTA.COMPLETAR_TAREA, datos: { valor: event.target.checked, tareas: 0 }});
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
                {stateTarea.tarea &&
                  stateTarea.tarea.map((tarea, iteracion) => (
                    <Tarea
                      id={iteracion}
                      key={iteracion}
                      onDelete={onDeleteHandler}
                      onChange={onChangeCheckboxHandler}
                      className={stateTarea.tache}
                      disabled={stateTarea.bloquear}
                    >
                      {tarea}
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
