import { useState } from "react";
import "./sass/styles.scss";
import Navbar from "./components/Navbar/Navbar";
import Lista from "./components/Listas/Lista";
import Form from "./components/Form/Form";
import { Tarea, Footer } from "./components/Listas/Elementos";

function App() {
  const [misTareas, setMisTareas] = useState([]);
  const [valorInput, setValorInput] = useState("");
  const [error, setError] = useState(false);
  const [errorTxt, setErrorTxt] = useState("");
  const [tareasCompletadas, setTareasCompletadas] = useState(0);
  const [tache, setTache] = useState('');
  const [bloquear, setBloquear] = useState('');
  
  const onAddButtonHandler = () => {
    misTareas.find((tarea) =>
      tarea === valorInput ? setError(true) : setError(false)
    );
    //Revisar
    if (error === true) {
      setErrorTxt("Ya existe esa tarea");
    } else {
      console.log(valorInput);
      setErrorTxt("");
      setMisTareas((prevValues) => {
        return [...prevValues, valorInput];
      });
      setValorInput("");
    }
  };

  const onChangeInputHandler = (event) => {
    if (
      event.target.value.trim().length < 4 &&
      event.target.value.trim().length > 0
    ) {
      setError(true);
      setErrorTxt("Ingrese más de 3 caracteres");
    } else {
      setError(false);
      setErrorTxt("");
    }
    setValorInput(event.target.value);
  };

  const onKeyDownHandler = (event) => {
    if (event.key === "Enter") {
      if (event.target.value.trim().length < 4 && event.target.value.trim().length > 0) {
        setError(true);
        setErrorTxt("Ingrese más de 3 caracteres");
      } else {
        setError(false);
        onAddButtonHandler();
      }
    }
  };

  const onDeleteHandler = (id) => {
    setMisTareas(prevTareas => {
      return misTareas.filter((tarea,iteracion) => iteracion !== id);
    })
  };

  const onChangeCheckboxHandler = event => {
    if(event.target.checked === true){
      setTareasCompletadas(+tareasCompletadas+1);
      setTache("completada");
      setBloquear("disabled");
    } else {
      tareasCompletadas > 0 ? setTareasCompletadas(+tareasCompletadas - 1) : setTareasCompletadas(0);
      setTache("");
      setBloquear("");
    }
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
                      value={valorInput}
                      onClick={onAddButtonHandler}
                      onKeyDown={onKeyDownHandler}
                      onChange={onChangeInputHandler}
                      error={error}
                      errorTxt={errorTxt}
                    ></Form>
                  </div>
                </div>
                {misTareas &&
                  misTareas.map((tarea, iteracion) => (
                    <Tarea
                      id={iteracion}
                      key={iteracion}
                      onDelete={onDeleteHandler}
                      onChange={onChangeCheckboxHandler}
                      className={tache}
                      disabled={bloquear}
                    >
                      {tarea}
                    </Tarea>
                  ))}
                <div className="container">
                  <Footer
                    total={misTareas.length}
                    completadas={tareasCompletadas}
                    abiertas={misTareas.length - tareasCompletadas}
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
